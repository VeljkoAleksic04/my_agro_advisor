import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VrstaBiljke } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BiljkaService } from './biljka.service';
import { CreateBiljkaDto } from './dto/create-biljka.dto';
import { UpdateBiljkaDto } from './dto/update-biljka.dto';
import { IzvrsiAkcijuDto } from './dto/izvrsi-akciju.dto';

@UseGuards(JwtAuthGuard)
@Controller('biljke')
export class BiljkaController {
  constructor(private readonly biljkaService: BiljkaService) {}

  @Post()
  create(@CurrentUser() korisnik: any, @Body() dto: CreateBiljkaDto) {
    return this.biljkaService.create(korisnik.id, dto);
  }

  @Get()
  findAll(
    @CurrentUser() korisnik: any,
    @Query('parcelaId', new ParseIntPipe({ optional: true })) parcelaId?: number,
  ) {
    if (parcelaId !== undefined) {
      return this.biljkaService.findAllZaParcelu(parcelaId);
    }
    return this.biljkaService.findAllZaKorisnika(korisnik.id);
  }

  // Preporuceni period setve/sadnje i berbe za datu vrstu - koristi front-end
  // za preview u formi. Mora biti definisan pre ':id' rute.
  @Get('preporuka/:vrsta')
  preporuka(@Param('vrsta', new ParseEnumPipe(VrstaBiljke)) vrsta: VrstaBiljke) {
    return this.biljkaService.preporukaZaVrstu(vrsta);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.biljkaService.findOne(id);
  }

  @Patch(':id')
  update(
    @CurrentUser() korisnik: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBiljkaDto,
  ) {
    return this.biljkaService.update(id, korisnik.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() korisnik: any, @Param('id', ParseIntPipe) id: number) {
    return this.biljkaService.remove(id, korisnik.id);
  }

  // Jedinstvena akcija nad biljkom: OBERI / ZALIJ / TRETIRAJ.
  @Post(':id/akcija')
  izvrsiAkciju(
    @CurrentUser() korisnik: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: IzvrsiAkcijuDto,
  ) {
    return this.biljkaService.izvrsiAkciju(id, korisnik.id, dto);
  }
}
