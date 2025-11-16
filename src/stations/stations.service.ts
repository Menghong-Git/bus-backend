import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
  ) {}

  async create(createStationDto: CreateStationDto): Promise<Station> {
    const station = this.stationRepository.create(createStationDto);
    return await this.stationRepository.save(station);
  }

  async findAll(): Promise<Station[]> {
    return await this.stationRepository.find({
      relations: ['originatingRoutes', 'destinationRoutes'],
    });
  }

  async findOne(id: string): Promise<Station> {
    const station = await this.stationRepository.findOne({
      where: { id },
      relations: ['originatingRoutes', 'destinationRoutes'],
    });

    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    return station;
  }

  async update(
    id: string,
    updateStationDto: UpdateStationDto,
  ): Promise<Station> {
    const station = await this.findOne(id);

    Object.assign(station, updateStationDto);
    return await this.stationRepository.save(station);
  }

  async remove(id: string): Promise<void> {
    const station = await this.findOne(id);
    await this.stationRepository.remove(station);
  }
}
