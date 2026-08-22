import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ObavestenjeService } from './obavestenje.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('obavestenja')
@UseGuards(JwtAuthGuard)
export class ObavestenjeController {
  constructor(private readonly obavestenjeService: ObavestenjeService) {}

  @Get()
  findAll(@CurrentUser() korisnik: any) {
    return this.obavestenjeService.findAll(korisnik.id);
  }

  @Get('neprocitana')
  neprocitana(@CurrentUser() korisnik: any) {
    return this.obavestenjeService.neprocitana(korisnik.id);
  }

  @Post(':id/procitaj')
  procitaj(@Param('id', ParseIntPipe) id: number, @CurrentUser() korisnik: any) {
    return this.obavestenjeService.procitaj(id, korisnik.id);
  }

  @Post('procitaj-sva')
  procitajSva(@CurrentUser() korisnik: any) {
    return this.obavestenjeService.procitajSva(korisnik.id);
  }
}
