import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PassengerProfilesService } from './passenger-profiles.service';
import { CreatePassengerProfileDto } from './dto/create-passenger-profile.dto';
import { UpdatePassengerProfileDto } from './dto/update-passenger-profile.dto';

@Controller('passenger-profiles')
export class PassengerProfilesController {
  constructor(
    private readonly passengerProfilesService: PassengerProfilesService,
  ) {}

  @Post()
  create(@Body() createPassengerProfileDto: CreatePassengerProfileDto) {
    return this.passengerProfilesService.create(createPassengerProfileDto);
  }

  @Get()
  findAll() {
    return this.passengerProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passengerProfilesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePassengerProfileDto: UpdatePassengerProfileDto,
  ) {
    return this.passengerProfilesService.update(id, updatePassengerProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passengerProfilesService.remove(id);
  }
}
