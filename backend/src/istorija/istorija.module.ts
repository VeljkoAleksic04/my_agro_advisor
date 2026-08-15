import { Module } from '@nestjs/common';
import { IstorijaService } from './istorija.service';
import { IstorijaController } from './istorija.controller';

@Module({
  controllers: [IstorijaController],
  providers: [IstorijaService],
})
export class IstorijaModule {}
