import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PreparatService } from './preparat.service';
import { CreatePreparatDto } from './dto/create-preparat.dto';
import { UpdatePreparatDto } from './dto/update-preparat.dto';

@UseGuards(JwtAuthGuard)
@Controller('preparati')
export class PreparatController {
  constructor(private readonly preparatService: PreparatService) {}

  @Post()
  create(@Body() dto: CreatePreparatDto) {
    return this.preparatService.create(dto);
  }

  @Get()
  findAll() {
    return this.preparatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preparatService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePreparatDto) {
    return this.preparatService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.preparatService.remove(id);
  }
}
