import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PoljoprivrednikService } from './poljoprivrednik.service';
import { UpdateProfilDto } from './dto/update-profil.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PromeniLozinkuDto } from './dto/promeni-lozinku.dto';

@UseGuards(JwtAuthGuard)
@Controller('profil')
export class PoljoprivrednikController {
  constructor(private readonly poljoprivrednikService: PoljoprivrednikService) {}

  @Get('korisnik/:id')
  pregledJavnog(@Param('id', ParseIntPipe) id: number) {
    return this.poljoprivrednikService.pregledJavnogProfila(id);
  }

  @Get()
  pregled(@CurrentUser() korisnik: any) {
    return this.poljoprivrednikService.pregled(korisnik.id);
  }

  @Patch()
  azuriraj(@CurrentUser() korisnik: any, @Body() dto: UpdateProfilDto) {
    return this.poljoprivrednikService.azurirajProfil(korisnik.id, dto);
  }

  @Post('slika')
  @UseInterceptors(
    FileInterceptor('slika', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Profilna slika mora biti u formatu slike.'), false);
        }
        cb(null, true);
      },
    }),
  )
  azurirajSliku(@CurrentUser() korisnik: any, @UploadedFile() fajl?: Express.Multer.File) {
    if (!fajl) {
      throw new BadRequestException('Profilna slika nije poslata.');
    }

    return this.poljoprivrednikService.azurirajProfilnuSliku(korisnik.id, fajl);
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
