import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminProfilesService } from './admin-profiles.service';
import { CreateAdminProfileDto } from './dto/create-admin-profile.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';

@Controller('admin-profiles')
export class AdminProfilesController {
  constructor(private readonly adminProfilesService: AdminProfilesService) {}

  @Post()
  create(@Body() createAdminProfileDto: CreateAdminProfileDto) {
    return this.adminProfilesService.create(createAdminProfileDto);
  }

  @Get()
  findAll() {
    return this.adminProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminProfilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminProfileDto: UpdateAdminProfileDto) {
    return this.adminProfilesService.update(+id, updateAdminProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminProfilesService.remove(+id);
  }
}
