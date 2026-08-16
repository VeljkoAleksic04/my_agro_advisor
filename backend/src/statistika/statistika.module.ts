import { Module } from '@nestjs/common';
import { StatistikaService } from './statistika.service';
import { StatistikaController } from './statistika.controller';

@Module({
  controllers: [StatistikaController],
  providers: [StatistikaService],
})
export class StatistikaModule {}
