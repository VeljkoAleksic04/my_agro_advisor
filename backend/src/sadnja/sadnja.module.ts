import { Module } from '@nestjs/common';
import { SadnjaService } from './sadnja.service';
import { SadnjaController } from './sadnja.controller';

@Module({
  controllers: [SadnjaController],
  providers: [SadnjaService],
  exports: [SadnjaService],
})
export class SadnjaModule {}
