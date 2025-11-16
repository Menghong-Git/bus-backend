import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  @Roles(UserRole.OPERATOR, UserRole.ADMIN, UserRole.PASSENGER)
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.OPERATOR, UserRole.ADMIN, UserRole.PASSENGER)
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Delete(':id')
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}
