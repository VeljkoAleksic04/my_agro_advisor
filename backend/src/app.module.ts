import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PoljoprivrednikModule } from './poljoprivrednik/poljoprivrednik.module';
import { ParcelaModule } from './parcela/parcela.module';
import { BiljkaModule } from './biljka/biljka.module';
import { PreparatModule } from './preparat/preparat.module';
import { TretmanModule } from './tretman/tretman.module';
import { SadnjaModule } from './sadnja/sadnja.module';
import { NavodnjavanjeModule } from './navodnjavanje/navodnjavanje.module';
import { TemaForumaModule } from './tema-foruma/tema-foruma.module';
import { PorukaForumaModule } from './poruka-foruma/poruka-foruma.module';
import { IstorijaModule } from './istorija/istorija.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PoljoprivrednikModule,
    ParcelaModule,
    BiljkaModule,
    PreparatModule,
    TretmanModule,
    SadnjaModule,
    NavodnjavanjeModule,
    TemaForumaModule,
    PorukaForumaModule,
    IstorijaModule,
  ],
})
export class AppModule {}
