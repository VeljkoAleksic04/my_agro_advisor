import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ParcelaService } from './parcela.service';
import { CreateParcelaDto } from './dto/create-parcela.dto';
import { UpdateParcelaDto } from './dto/update-parcela.dto';

@UseGuards(JwtAuthGuard)
@Controller('parcele')
export class ParcelaController {
  constructor(private readonly parcelaService: ParcelaService) {}

  @Post()
  create(@CurrentUser() korisnik: any, @Body() dto: CreateParcelaDto) {
    return this.parcelaService.create(korisnik.id, dto);
  }

  @Get()
  findAll(@CurrentUser() korisnik: any) {
    return this.parcelaService.findAllZaKorisnika(korisnik.id);
  }

  @Get(':id')
  findOne(@CurrentUser() korisnik: any, @Param('id', ParseIntPipe) id: number) {
    return this.parcelaService.findOne(id, korisnik.id);
  }

  @Patch(':id')
  update(
    @CurrentUser() korisnik: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateParcelaDto,
  ) {
    return this.parcelaService.update(id, korisnik.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() korisnik: any, @Param('id', ParseIntPipe) id: number) {
    return this.parcelaService.remove(id, korisnik.id);
  }
}
