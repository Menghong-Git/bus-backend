import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { SearchTripsDto } from './dto/search-trips.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.tripsService.findAll();
  }

  @Get(':id/seat-map') // This should match /trips/:id/seat-map
  @UseGuards(JwtAuthGuard)
  async getSeatMap(@Param('id') id: string) {
    return this.tripsService.getSeatMap(id);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  search(@Query() searchTripsDto: SearchTripsDto) {
    return this.tripsService.searchTrips(searchTripsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Post(':id/validate-seats')
  @UseGuards(JwtAuthGuard)
  async validateSeatAvailability(
    @Param('id') id: string,
    @Body() body: { seatNumbers: string[] },
  ) {
    return this.tripsService.validateSeatAvailability(id, body.seatNumbers);
  }

  @Get(':id/real-time-availability')
  @UseGuards(JwtAuthGuard)
  async getRealTimeAvailability(@Param('id') id: string) {
    const availableSeats =
      await this.tripsService.getRealTimeAvailableSeats(id);
    return { availableSeats };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripsService.update(id, updateTripDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.tripsService.remove(id);
  }
}
