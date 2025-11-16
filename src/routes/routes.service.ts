import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './entities/route.entity';
import { Station } from '../stations/entities/station.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
    @InjectRepository(Station)
    private stationsRepository: Repository<Station>,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    // Check if origin and destination stations exist
    const origin = await this.stationsRepository.findOne({
      where: { id: createRouteDto.originId },
    });
    const destination = await this.stationsRepository.findOne({
      where: { id: createRouteDto.destinationId },
    });

    if (!origin) {
      throw new NotFoundException('Origin station not found');
    }

    if (!destination) {
      throw new NotFoundException('Destination station not found');
    }

    // Check if route already exists between these stations
    const existingRoute = await this.routesRepository.findOne({
      where: {
        originId: createRouteDto.originId,
        destinationId: createRouteDto.destinationId,
      },
    });

    if (existingRoute) {
      throw new NotFoundException(
        'Route already exists between these stations',
      );
    }

    const route = this.routesRepository.create(createRouteDto);
    const savedRoute = await this.routesRepository.save(route);

    // Return the route with relations
    const savedRouteWithRelations = await this.routesRepository.findOne({
      where: { id: savedRoute.id },
      relations: ['origin', 'destination'],
    });

    if (!savedRouteWithRelations) {
      throw new NotFoundException('Route not found after creation');
    }

    return savedRouteWithRelations;
  }

  async findAll(): Promise<Route[]> {
    return await this.routesRepository.find({
      relations: ['origin', 'destination'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routesRepository.findOne({
      where: { id },
      relations: ['origin', 'destination', 'trips'],
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto): Promise<Route> {
    const route = await this.findOne(id);

    // If updating stations, verify they exist
    if (updateRouteDto.originId) {
      const origin = await this.stationsRepository.findOne({
        where: { id: updateRouteDto.originId },
      });
      if (!origin) {
        throw new NotFoundException('Origin station not found');
      }
    }

    if (updateRouteDto.destinationId) {
      const destination = await this.stationsRepository.findOne({
        where: { id: updateRouteDto.destinationId },
      });
      if (!destination) {
        throw new NotFoundException('Destination station not found');
      }
    }

    await this.routesRepository.update(id, updateRouteDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const route = await this.findOne(id);
    await this.routesRepository.remove(route);
  }
}
