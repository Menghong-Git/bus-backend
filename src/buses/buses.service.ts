import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bus } from './entities/bus.entity';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';

@Injectable()
export class BusesService {
  constructor(
    @InjectRepository(Bus)
    private busRepository: Repository<Bus>,
  ) {}

  async create(createBusDto: CreateBusDto): Promise<Bus> {
    const bus = this.busRepository.create(createBusDto);
    return await this.busRepository.save(bus);
  }

  async findAll(): Promise<Bus[]> {
    return await this.busRepository.find({
      relations: ['trips', 'seats'],
    });
  }

  async findOne(id: string): Promise<Bus> {
    const bus = await this.busRepository.findOne({
      where: { id },
      relations: ['trips', 'seats'],
    });

    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }

    return bus;
  }

  async update(id: string, updateBusDto: UpdateBusDto): Promise<Bus> {
    const bus = await this.findOne(id);

    Object.assign(bus, updateBusDto);
    return await this.busRepository.save(bus);
  }

  async remove(id: string): Promise<void> {
    const bus = await this.findOne(id);
    await this.busRepository.remove(bus);
  }
}
