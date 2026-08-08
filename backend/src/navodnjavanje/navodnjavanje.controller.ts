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
import { NavodnjavanjeService } from './navodnjavanje.service';
import { CreateNavodnjavanjeDto } from './dto/create-navodnjavanje.dto';
import { UpdateNavodnjavanjeDto } from './dto/update-navodnjavanje.dto';

@UseGuards(JwtAuthGuard)
@Controller('navodnjavanja')
export class NavodnjavanjeController {
  constructor(private readonly navodnjavanjeService: NavodnjavanjeService) {}

  @Post()
  create(@CurrentUser() korisnik: any, @Body() dto: CreateNavodnjavanjeDto) {
    return this.navodnjavanjeService.create(korisnik.id, dto);
  }

  @Get()
  findAll(@CurrentUser() korisnik: any) {
    return this.navodnjavanjeService.findAllZaKorisnika(korisnik.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.navodnjavanjeService.findOne(id);
  }

  @Patch(':id')
  update(
    @CurrentUser() korisnik: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNavodnjavanjeDto,
  ) {
    return this.navodnjavanjeService.update(id, korisnik.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() korisnik: any, @Param('id', ParseIntPipe) id: number) {
    return this.navodnjavanjeService.remove(id, korisnik.id);
  }
}
