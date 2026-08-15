import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IstorijaService } from './istorija.service';

@UseGuards(JwtAuthGuard)
@Controller('istorija')
export class IstorijaController {
  constructor(private readonly istorijaService: IstorijaService) {}

  /** GET /istorija?godina=2024 — istorija sadnje i evidencija tretmana po parcelama za ulogovanog farmera. */
  @Get()
  pregled(@CurrentUser() korisnik: any, @Query('godina') godina?: string) {
    const godinaBroj = godina ? parseInt(godina, 10) : undefined;
    return this.istorijaService.pregledZaKorisnika(korisnik.id, godinaBroj);
  }
}
