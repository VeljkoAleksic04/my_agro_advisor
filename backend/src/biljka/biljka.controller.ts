import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BiljkaService } from './biljka.service';
import { CreateBiljkaDto } from './dto/create-biljka.dto';
import { UpdateBiljkaDto } from './dto/update-biljka.dto';

@UseGuards(JwtAuthGuard)
@Controller('biljke')
export class BiljkaController {
  constructor(private readonly biljkaService: BiljkaService) {}

  @Post()
  create(@CurrentUser() korisnik: any, @Body() dto: CreateBiljkaDto) {
    return this.biljkaService.create(korisnik.id, dto);
  }

  @Get()
  findAll(@Query('parcelaId', new ParseIntPipe()) parcelaId: number) {
    return this.biljkaService.findAllZaParcelu(parcelaId);
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
}
