import { Module } from '@nestjs/common';
import { KalendarController } from './kalendar.controller';
import { KalendarService } from './kalendar.service';

@Module({
  controllers: [KalendarController],
  providers: [KalendarService],
})
export class KalendarModule {}
