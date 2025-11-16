import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seat } from './entities/seat.entity';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  async create(createSeatDto: CreateSeatDto): Promise<Seat> {
    const seat = this.seatRepository.create(createSeatDto);
    return await this.seatRepository.save(seat);
  }

  async findAll(): Promise<Seat[]> {
    return await this.seatRepository.find({
      relations: ['bus', 'bookingSeats'],
    });
  }

  async findOne(id: string): Promise<Seat> {
    const seat = await this.seatRepository.findOne({
      where: { id },
      relations: ['bus', 'bookingSeats'],
    });

    if (!seat) {
      throw new NotFoundException(`Seat with ID ${id} not found`);
    }

    return seat;
  }

  async update(id: string, updateSeatDto: UpdateSeatDto): Promise<Seat> {
    const seat = await this.findOne(id);

    Object.assign(seat, updateSeatDto);
    return await this.seatRepository.save(seat);
  }

  async remove(id: string): Promise<void> {
    const seat = await this.findOne(id);
    await this.seatRepository.remove(seat);
  }
}
