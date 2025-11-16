import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Trip } from '../trips/entities/trip.entity';
import { BookingSeat } from '../booking-seats/entities/booking-seat.entity';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { TripsService } from '../trips/trips.service';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(BookingSeat)
    private bookingSeatRepository: Repository<BookingSeat>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private tripsService: TripsService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { tripId, passengers, seatCount, userId } = createBookingDto;

    // Validate trip exists
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['bus'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Check if trip is scheduled
    if (trip.status !== 'SCHEDULED') {
      throw new BadRequestException('Cannot book a trip that is not scheduled');
    }

    // Validate seat count matches passengers
    if (seatCount !== passengers.length) {
      throw new BadRequestException(
        'Seat count must match number of passengers',
      );
    }

    // Extract seat numbers from passengers
    const seatNumbers = passengers.map((p) => p.seatNumber).filter(Boolean);

    if (seatNumbers.length !== passengers.length) {
      throw new BadRequestException('Each passenger must have a seat number');
    }

    // Real-time seat validation using TripsService
    const seatValidation = await this.tripsService.validateSeatAvailability(
      tripId,
      seatNumbers,
    );

    if (!seatValidation.available) {
      throw new BadRequestException(
        seatValidation.message || 'Selected seats are not available',
      );
    }

    // Calculate total amount
    const totalAmount = trip.price * seatCount;

    // Generate PNR
    const pnr = this.generatePNR();

    // Create booking
    const booking = this.bookingRepository.create({
      tripId,
      userId,
      pnr,
      seatCount,
      totalAmount,
      status: BookingStatus.PENDING,
      passengerDetails: passengers,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // FIXED: Create booking seats without seat_id
    const bookingSeats = seatNumbers.map((seatNumber) => {
      return this.bookingSeatRepository.create({
        bookingId: savedBooking.id,
        seatNumber: seatNumber,
        // Don't include seat_id if you don't have it
      });
    });

    await this.bookingSeatRepository.save(bookingSeats);

    // Return booking with relations
    const finalBooking = await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: [
        'trip',
        'trip.route',
        'trip.bus',
        'trip.route.origin',
        'trip.route.destination',
      ],
    });

    if (!finalBooking) {
      throw new NotFoundException('Booking not found after creation');
    }

    return finalBooking;
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      relations: ['trip', 'trip.route', 'trip.bus', 'payments'], // ADDED: payments relation
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: [
        'trip',
        'trip.route',
        'trip.bus',
        'trip.route.origin',
        'trip.route.destination',
        'payments', // ADDED: payments relation
        'bookingSeats',
      ],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { userId },
      relations: ['trip', 'trip.route', 'trip.bus', 'payments'], // ADDED: payments relation
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    await this.bookingRepository.update(id, updateBookingDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }

  // Complete booking after payment
  async completeBooking(
    bookingId: string,
    paymentId: string,
  ): Promise<Booking> {
    const booking = await this.findOne(bookingId);

    // Update booking status to CONFIRMED
    booking.status = BookingStatus.CONFIRMED;
    booking.expiresAt = null;

    const updatedBooking = await this.bookingRepository.save(booking);

    // Update trip capacity
    await this.updateTripCapacity(booking.tripId, booking.seatCount);

    return updatedBooking;
  }

  // Cancel booking
  async cancelBooking(id: string): Promise<Booking> {
    const booking = await this.findOne(id);

    // Store the original status before updating
    const originalStatus = booking.status;

    // Only allow cancellation for PENDING or CONFIRMED bookings
    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException('Cannot cancel this booking');
    }

    booking.status = BookingStatus.CANCELLED;

    // If booking was confirmed, restore trip capacity
    if (originalStatus === BookingStatus.CONFIRMED) {
      await this.updateTripCapacity(booking.tripId, -booking.seatCount);
    }

    return await this.bookingRepository.save(booking);
  }

  // Update trip capacity
  private async updateTripCapacity(
    tripId: string,
    seatChange: number,
  ): Promise<void> {
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });
    if (trip) {
      trip.capacity -= seatChange;
      await this.tripRepository.save(trip);
    }
  }

  // Generate PNR (Passenger Name Record)
  private generatePNR(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pnr;
  }

  // Check if booking can be completed (seats still available)
  async validateBookingCompletion(bookingId: string): Promise<{
    valid: boolean;
    message?: string;
    booking?: Booking;
  }> {
    const booking = await this.findOne(bookingId);

    if (booking.status !== BookingStatus.PENDING) {
      return {
        valid: false,
        message: 'Booking is not in pending status',
      };
    }

    // Check if seats are still available
    const seatNumbers = booking.passengerDetails.map((p) => p.seatNumber);
    const seatValidation = await this.tripsService.validateSeatAvailability(
      booking.tripId,
      seatNumbers,
    );

    if (!seatValidation.available) {
      return {
        valid: false,
        message:
          seatValidation.message || 'Selected seats are no longer available',
        booking,
      };
    }

    return {
      valid: true,
      booking,
    };
  }
}
