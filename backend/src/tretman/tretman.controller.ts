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
import { TretmanService } from './tretman.service';
import { CreateTretmanDto } from './dto/create-tretman.dto';
import { UpdateTretmanDto } from './dto/update-tretman.dto';

@UseGuards(JwtAuthGuard)
@Controller('tretmani')
export class TretmanController {
  constructor(private readonly tretmanService: TretmanService) {}

  @Post()
  create(@CurrentUser() korisnik: any, @Body() dto: CreateTretmanDto) {
    return this.tretmanService.create(korisnik.id, dto);
  }

  @Get()
  findAll(@Query('parcelaId', ParseIntPipe) parcelaId: number) {
    return this.tretmanService.findAllZaParcelu(parcelaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tretmanService.findOne(id);
  }

  @Patch(':id')
  update(
    @CurrentUser() korisnik: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTretmanDto,
  ) {
    return this.tretmanService.update(id, korisnik.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() korisnik: any, @Param('id', ParseIntPipe) id: number) {
    return this.tretmanService.remove(id, korisnik.id);
  }
}
