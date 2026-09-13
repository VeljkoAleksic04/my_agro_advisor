import { Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('korisnici')
  korisnici(@CurrentUser() korisnik: any) {
    return this.chatService.korisnici(korisnik.id);
  }

  @Post('kontakt/:korisnikId')
  kontakt(@CurrentUser() korisnik: any, @Param('korisnikId', ParseIntPipe) korisnikId: number) {
    return this.chatService.zapocniKontakt(korisnik.id, korisnikId);
  }

  @Get('neprocitane')
  neprocitane(@CurrentUser() korisnik: any) {
    return this.chatService.brojNeprocitanih(korisnik.id);
  }

  @Get('poruke/:korisnikId')
  poruke(@CurrentUser() korisnik: any, @Param('korisnikId', ParseIntPipe) korisnikId: number) {
    return this.chatService.poruke(korisnik.id, korisnikId);
  }

  @Patch('procitano/:korisnikId')
  procitano(@CurrentUser() korisnik: any, @Param('korisnikId', ParseIntPipe) korisnikId: number) {
    return this.chatService.oznaciProcitano(korisnik.id, korisnikId);
  }
}
