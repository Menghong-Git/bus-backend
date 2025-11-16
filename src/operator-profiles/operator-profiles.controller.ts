import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OperatorProfilesService } from './operator-profiles.service';
import { CreateOperatorProfileDto } from './dto/create-operator-profile.dto';
import { UpdateOperatorProfileDto } from './dto/update-operator-profile.dto';

@Controller('operator-profiles')
export class OperatorProfilesController {
  constructor(
    private readonly operatorProfilesService: OperatorProfilesService,
  ) {}

  @Post()
  create(@Body() createOperatorProfileDto: CreateOperatorProfileDto) {
    return this.operatorProfilesService.create(createOperatorProfileDto);
  }

  @Get()
  findAll() {
    return this.operatorProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operatorProfilesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOperatorProfileDto: UpdateOperatorProfileDto,
  ) {
    return this.operatorProfilesService.update(id, updateOperatorProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operatorProfilesService.remove(id);
  }
}
