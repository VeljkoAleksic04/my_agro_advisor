import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PoljoprivrednikService } from './poljoprivrednik.service';

@UseGuards(JwtAuthGuard)
@Controller('profil')
export class PoljoprivrednikController {
  constructor(private readonly poljoprivrednikService: PoljoprivrednikService) {}

  @Get('poeni')
  poeni(@CurrentUser() korisnik: any) {
    return this.poljoprivrednikService.istorijaPoena(korisnik.id);
  }
}
