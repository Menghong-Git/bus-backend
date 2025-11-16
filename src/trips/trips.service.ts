import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { SearchTripsDto } from './dto/search-trips.dto';
import { TripStatus } from '../common/enums/trip-status.enum';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { Seat } from '../seats/entities/seat.entity';
import { BookingSeat } from '../booking-seats/entities/booking-seat.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
    @InjectRepository(Seat)
    private seatsRepository: Repository<Seat>,
    @InjectRepository(BookingSeat)
    private bookingSeatsRepository: Repository<BookingSeat>,
  ) {}

  async create(createTripDto: CreateTripDto): Promise<Trip> {
    const trip = this.tripsRepository.create(createTripDto);
    const savedTrip = await this.tripsRepository.save(trip);

    // Return the trip with relations
    const createdTrip = await this.tripsRepository.findOne({
      where: { id: savedTrip.id },
      relations: ['route', 'route.origin', 'route.destination', 'bus'],
    });

    if (!createdTrip) {
      throw new NotFoundException(`Trip with ID ${savedTrip.id} not found`);
    }

    return createdTrip;
  }

  async findAll(): Promise<Trip[]> {
    return await this.tripsRepository.find({
      relations: ['route', 'route.origin', 'route.destination', 'bus'],
      order: { departureDate: 'DESC', departureTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Trip> {
    const trip = await this.tripsRepository.findOne({
      where: { id },
      relations: [
        'route',
        'route.origin',
        'route.destination',
        'bus',
        'bookings',
      ],
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    return trip;
  }

  async searchTrips(searchTripsDto: SearchTripsDto): Promise<Trip[]> {
    const { originCity, destinationCity, departureDate } = searchTripsDto;

    const trips = await this.tripsRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.route', 'route')
      .leftJoinAndSelect('route.origin', 'origin')
      .leftJoinAndSelect('route.destination', 'destination')
      .leftJoinAndSelect('trip.bus', 'bus')
      .where('origin.city = :originCity', { originCity })
      .andWhere('destination.city = :destinationCity', { destinationCity })
      .andWhere('trip.departureDate = :departureDate', { departureDate })
      .andWhere('trip.status = :status', { status: TripStatus.SCHEDULED })
      .andWhere('trip.capacity > 0')
      .orderBy('trip.departureTime', 'ASC')
      .getMany();

    return trips;
  }

  async getAvailableSeats(tripId: string): Promise<number> {
    const trip = await this.findOne(tripId);

    // Calculate booked seats using proper enum values
    const bookedSeats =
      trip.bookings?.reduce((total, booking) => {
        return (
          total +
          (booking.status === BookingStatus.CONFIRMED ? booking.seatCount : 0)
        );
      }, 0) || 0;

    return trip.capacity - bookedSeats;
  }

  // NEW: Real-time seat validation method
  async validateSeatAvailability(
    tripId: string,
    seatNumbers: string[],
  ): Promise<{
    available: boolean;
    bookedSeats: string[];
    message?: string;
  }> {
    const trip = await this.tripsRepository.findOne({
      where: { id: tripId },
      relations: ['bus'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Check if trip is scheduled
    if (trip.status !== TripStatus.SCHEDULED) {
      return {
        available: false,
        bookedSeats: [],
        message: 'This trip is no longer available for booking',
      };
    }

    // Get all booked seats for this trip
    const bookedSeats = await this.bookingSeatsRepository
      .createQueryBuilder('bookingSeat')
      .leftJoin('bookingSeat.booking', 'booking')
      .where('booking.tripId = :tripId', { tripId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [
          BookingStatus.CONFIRMED,
          BookingStatus.PENDING,
          BookingStatus.PAID,
        ],
      })
      .getMany();

    const bookedSeatNumbers = bookedSeats.map((bs) => bs.seatNumber);

    // Check if any requested seats are already booked
    const alreadyBooked = seatNumbers.filter((seat) =>
      bookedSeatNumbers.includes(seat),
    );

    if (alreadyBooked.length > 0) {
      return {
        available: false,
        bookedSeats: alreadyBooked,
        message: `Seats ${alreadyBooked.join(', ')} are already booked. Please select different seats.`,
      };
    }

    // Check if seats exist in the bus
    const existingSeats = await this.seatsRepository.find({
      where: { busId: trip.busId },
    });

    const existingSeatNumbers = existingSeats.map((seat) => seat.seatNumber);
    const invalidSeats = seatNumbers.filter(
      (seat) => !existingSeatNumbers.includes(seat),
    );

    if (invalidSeats.length > 0) {
      return {
        available: false,
        bookedSeats: [],
        message: `Seats ${invalidSeats.join(', ')} do not exist on this bus.`,
      };
    }

    return {
      available: true,
      bookedSeats: [],
    };
  }

  async getSeatMap(tripId: string): Promise<any> {
    console.log(`🔍 Generating seat map for trip: ${tripId}`);

    const trip = await this.tripsRepository.findOne({
      where: { id: tripId },
      relations: ['bus', 'bookings', 'bookings.bookingSeats'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    console.log(`✅ Found trip with bus capacity: ${trip.bus.capacity}`);

    // Get all seats for the bus - if no seats exist in database, generate them
    let seats = await this.seatsRepository.find({
      where: { busId: trip.busId },
      order: { seatNumber: 'ASC' },
    });

    console.log(`✅ Found ${seats.length} seats in database`);

    // If no seats exist in database, generate them
    if (seats.length === 0) {
      console.log('🔄 No seats found in database, generating default seats');
      seats = this.generateDefaultSeatsForBus(trip.busId, trip.bus.capacity);
      // Save generated seats to database
      await this.seatsRepository.save(seats);
    }

    // Get booked seats for this trip
    const bookedSeats = await this.bookingSeatsRepository
      .createQueryBuilder('bookingSeat')
      .leftJoin('bookingSeat.booking', 'booking')
      .where('booking.tripId = :tripId', { tripId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [
          BookingStatus.CONFIRMED,
          BookingStatus.PENDING,
          BookingStatus.PAID,
        ],
      })
      .getMany();

    console.log(`✅ Found ${bookedSeats.length} booked seats`);

    const bookedSeatNumbers = bookedSeats.map((bs) => bs.seatNumber);

    // Create seat map
    const seatMap = seats.map((seat) => ({
      seatNumber: seat.seatNumber,
      available: !bookedSeatNumbers.includes(seat.seatNumber),
      type: seat.type,
    }));

    const availableSeatsCount = seatMap.filter((s) => s.available).length;

    console.log(
      `✅ Generated seat map with ${seatMap.length} seats, ${availableSeatsCount} available`,
    );

    return {
      tripId,
      bus: trip.bus,
      totalSeats: trip.bus.capacity,
      availableSeats: availableSeatsCount,
      seatMap,
    };
  }

  // NEW: Get real-time available seats count
  async getRealTimeAvailableSeats(tripId: string): Promise<number> {
    const seatMap = await this.getSeatMap(tripId);
    return seatMap.availableSeats;
  }

  private generateDefaultSeatsForBus(busId: string, capacity: number): Seat[] {
    const seats: Seat[] = [];

    for (let i = 1; i <= capacity; i++) {
      const row = Math.ceil(i / 4);
      const positionInRow = (i - 1) % 4;
      const seatLetter = String.fromCharCode(65 + positionInRow);

      let type: 'WINDOW' | 'AISLE' | 'MIDDLE';
      if (positionInRow === 0 || positionInRow === 3) {
        type = 'WINDOW';
      } else {
        type = 'AISLE';
      }

      const seat = new Seat();
      seat.busId = busId;
      seat.seatNumber = `${row}${seatLetter}`;
      seat.type = type;
      seat.isActive = true;
      seat.createdAt = new Date();
      seat.updatedAt = new Date();

      seats.push(seat);
    }

    console.log(`✅ Generated ${seats.length} default seats for bus ${busId}`);
    return seats;
  }

  async update(id: string, updateTripDto: UpdateTripDto): Promise<Trip> {
    await this.tripsRepository.update(id, updateTripDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.tripsRepository.delete(id);
  }
}
