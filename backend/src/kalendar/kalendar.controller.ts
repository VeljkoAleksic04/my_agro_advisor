import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { KalendarService } from './kalendar.service';
import { CreateKalendarDogadjajDto } from './dto/create-kalendar-dogadjaj.dto';

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
}
