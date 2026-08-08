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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TemaForumaService } from './tema-foruma.service';
import { CreateTemaForumaDto } from './dto/create-tema-foruma.dto';
import { UpdateTemaForumaDto } from './dto/update-tema-foruma.dto';

@Controller('teme-foruma')
export class TemaForumaController {
  constructor(private readonly temaForumaService: TemaForumaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() korisnik: any, @Body() dto: CreateTemaForumaDto) {
    return this.temaForumaService.create(korisnik.id, dto);
  }

  @Get()
  findAll() {
    return this.temaForumaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.temaForumaService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @CurrentUser() korisnik: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTemaForumaDto,
  ) {
    return this.temaForumaService.update(id, korisnik.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@CurrentUser() korisnik: any, @Param('id', ParseIntPipe) id: number) {
    return this.temaForumaService.remove(id, korisnik.id);
  }
}
