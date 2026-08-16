import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VrstaBiljke } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StatistikaService } from './statistika.service';

@UseGuards(JwtAuthGuard)
@Controller('statistika')
export class StatistikaController {
  constructor(private readonly statistikaService: StatistikaService) {}

  /** GET /statistika?godina=2024&vrsta=PSENICA&parcelaId=3 — agregirani uticaj tretmana na prinos. */
  @Get()
  pregled(
    @CurrentUser() korisnik: any,
    @Query('godina') godina?: string,
    @Query('vrsta') vrsta?: VrstaBiljke,
    @Query('parcelaId') parcelaId?: string,
  ) {
    return this.statistikaService.pregled(korisnik.id, {
      godina: godina ? parseInt(godina, 10) : undefined,
      vrsta: vrsta || undefined,
      parcelaId: parcelaId ? parseInt(parcelaId, 10) : undefined,
    });
  }
}
