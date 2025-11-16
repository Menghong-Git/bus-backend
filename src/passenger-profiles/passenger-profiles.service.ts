import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassengerProfile } from './entities/passenger-profile.entity';
import { CreatePassengerProfileDto } from './dto/create-passenger-profile.dto';
import { UpdatePassengerProfileDto } from './dto/update-passenger-profile.dto';

@Injectable()
export class PassengerProfilesService {
  constructor(
    @InjectRepository(PassengerProfile)
    private readonly repo: Repository<PassengerProfile>, // ✅ unified property name
  ) {}

  async create(dto: CreatePassengerProfileDto): Promise<PassengerProfile> {
    const profile = this.repo.create(dto);
    return this.repo.save(profile);
  }

  async updateByUserId(userId: string, data: Partial<PassengerProfile>) {
    const profile = await this.repo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Passenger profile not found');
    Object.assign(profile, data);
    return this.repo.save(profile);
  }

  async findByUserId(userId: string) {
    return this.repo.findOne({ where: { userId } });
  }

  async findOrCreateByUserId(
    userId: string,
    createData?: Partial<PassengerProfile>,
  ): Promise<PassengerProfile> {
    let profile = await this.findByUserId(userId);
    if (!profile && createData) {
      profile = await this.create({
        userId,
        firstName: createData.firstName || 'Unknown',
        lastName: createData.lastName || 'Unknown',
        phone: createData.phone || '',
        nationality: createData.nationality || '',
      });
    }
    if (!profile)
      throw new Error(`Passenger profile not found for user ${userId}`);
    return profile;
  }

  async findAll(): Promise<PassengerProfile[]> {
    return this.repo.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<PassengerProfile> {
    const profile = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile)
      throw new NotFoundException(`Passenger profile with ID ${id} not found`);
    return profile;
  }

  async update(
    id: string,
    dto: UpdatePassengerProfileDto,
  ): Promise<PassengerProfile> {
    const profile = await this.findOne(id);
    Object.assign(profile, dto);
    return this.repo.save(profile);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
