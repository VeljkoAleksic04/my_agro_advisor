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
import { SadnjaService } from './sadnja.service';
import { CreateSadnjaDto } from './dto/create-sadnja.dto';
import { UpdateSadnjaDto } from './dto/update-sadnja.dto';

@UseGuards(JwtAuthGuard)
@Controller('sadnje')
export class SadnjaController {
  constructor(private readonly sadnjaService: SadnjaService) {}

  @Post()
  create(@CurrentUser() korisnik: any, @Body() dto: CreateSadnjaDto) {
    return this.sadnjaService.create(korisnik.id, dto);
  }

  @Get()
  findAll(@CurrentUser() korisnik: any) {
    return this.sadnjaService.findAllZaKorisnika(korisnik.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sadnjaService.findOne(id);
  }

  @Patch(':id')
  update(
    @CurrentUser() korisnik: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSadnjaDto,
  ) {
    return this.sadnjaService.update(id, korisnik.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() korisnik: any, @Param('id', ParseIntPipe) id: number) {
    return this.sadnjaService.remove(id, korisnik.id);
  }
}
