import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { KalendarService } from './kalendar.service';
import { CreateKalendarDogadjajDto } from './dto/create-kalendar-dogadjaj.dto';
import { UpdateKalendarDogadjajDto } from './dto/update-kalendar-dogadjaj.dto';

@UseGuards(JwtAuthGuard)
@Controller('kalendar')
export class KalendarController {
  constructor(private readonly kalendarService: KalendarService) {}

  @Get()
  findAll(@CurrentUser() korisnik: any) {
    return this.kalendarService.findAllZaKorisnika(korisnik.id);
  }

  @Post()
  create(@CurrentUser() korisnik: any, @Body() dto: CreateKalendarDogadjajDto) {
    return this.kalendarService.create(korisnik.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() korisnik: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKalendarDogadjajDto,
  ) {
    return this.kalendarService.update(korisnik.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() korisnik: any, @Param('id', ParseIntPipe) id: number) {
    return this.kalendarService.remove(korisnik.id, id);
  }
}
