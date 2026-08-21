import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PoljoprivrednikService } from './poljoprivrednik.service';
import { UpdateProfilDto } from './dto/update-profil.dto';
import { PromeniLozinkuDto } from './dto/promeni-lozinku.dto';

@UseGuards(JwtAuthGuard)
@Controller('profil')
export class PoljoprivrednikController {
  constructor(private readonly poljoprivrednikService: PoljoprivrednikService) {}

  @Get()
  pregled(@CurrentUser() korisnik: any) {
    return this.poljoprivrednikService.pregled(korisnik.id);
  }

  @Patch()
  azuriraj(@CurrentUser() korisnik: any, @Body() dto: UpdateProfilDto) {
    return this.poljoprivrednikService.azurirajProfil(korisnik.id, dto);
  }

  @Patch('lozinka')
  promeniLozinku(@CurrentUser() korisnik: any, @Body() dto: PromeniLozinkuDto) {
    return this.poljoprivrednikService.promeniLozinku(korisnik.id, dto);
  }

  @Get('poeni')
  poeni(@CurrentUser() korisnik: any) {
    return this.poljoprivrednikService.istorijaPoena(korisnik.id);
  }
}
