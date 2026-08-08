import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PorukaForumaService } from './poruka-foruma.service';
import { CreatePorukaForumaDto } from './dto/create-poruka-foruma.dto';

@Controller('poruke-foruma')
export class PorukaForumaController {
  constructor(private readonly porukaForumaService: PorukaForumaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() korisnik: any, @Body() dto: CreatePorukaForumaDto) {
    return this.porukaForumaService.create(korisnik.id, dto);
  }

  @Get()
  findAll(@Query('temaId', ParseIntPipe) temaId: number) {
    return this.porukaForumaService.findAllZaTemu(temaId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@CurrentUser() korisnik: any, @Param('id', ParseIntPipe) id: number) {
    return this.porukaForumaService.remove(id, korisnik.id);
  }
}
