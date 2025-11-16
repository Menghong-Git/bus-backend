import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingSeat } from './entities/booking-seat.entity';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';
import { UpdateBookingSeatDto } from './dto/update-booking-seat.dto';

@Injectable()
export class BookingSeatsService {
  constructor(
    @InjectRepository(BookingSeat)
    private bookingSeatRepository: Repository<BookingSeat>,
  ) {}

  async create(
    createBookingSeatDto: CreateBookingSeatDto,
  ): Promise<BookingSeat> {
    const bookingSeat = this.bookingSeatRepository.create(createBookingSeatDto);
    return await this.bookingSeatRepository.save(bookingSeat);
  }

  async findAll(): Promise<BookingSeat[]> {
    return await this.bookingSeatRepository.find({
      relations: ['booking', 'seat'],
    });
  }

  async findOne(id: string): Promise<BookingSeat> {
    const bookingSeat = await this.bookingSeatRepository.findOne({
      where: { id },
      relations: ['booking', 'seat'],
    });

    if (!bookingSeat) {
      throw new NotFoundException(`BookingSeat with ID ${id} not found`);
    }

    return bookingSeat;
  }

  async update(
    id: string,
    updateBookingSeatDto: UpdateBookingSeatDto,
  ): Promise<BookingSeat> {
    const bookingSeat = await this.findOne(id);

    Object.assign(bookingSeat, updateBookingSeatDto);
    return await this.bookingSeatRepository.save(bookingSeat);
  }

  async remove(id: string): Promise<void> {
    const bookingSeat = await this.findOne(id);
    await this.bookingSeatRepository.remove(bookingSeat);
  }
}
