import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperatorProfile } from './entities/operator-profile.entity';
import { CreateOperatorProfileDto } from './dto/create-operator-profile.dto';
import { UpdateOperatorProfileDto } from './dto/update-operator-profile.dto';

@Injectable()
export class OperatorProfilesService {
  constructor(
    @InjectRepository(OperatorProfile)
    private readonly repo: Repository<OperatorProfile>, // ✅ unified property name
  ) {}

  async create(dto: CreateOperatorProfileDto): Promise<OperatorProfile> {
    const profile = this.repo.create(dto);
    return this.repo.save(profile);
  }

  async updateByUserId(userId: string, data: Partial<OperatorProfile>) {
    const profile = await this.repo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Operator profile not found');
    Object.assign(profile, data);
    return this.repo.save(profile);
  }

  async findByUserId(userId: string) {
    return this.repo.findOne({ where: { userId } });
  }

  async findAll(): Promise<OperatorProfile[]> {
    return this.repo.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<OperatorProfile> {
    const profile = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile)
      throw new NotFoundException(`Operator profile with ID ${id} not found`);
    return profile;
  }

  async update(
    id: string,
    dto: UpdateOperatorProfileDto,
  ): Promise<OperatorProfile> {
    const profile = await this.findOne(id);
    Object.assign(profile, dto);
    return this.repo.save(profile);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
