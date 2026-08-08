import { Module } from '@nestjs/common';
import { PreparatService } from './preparat.service';
import { PreparatController } from './preparat.controller';

@Module({
  controllers: [PreparatController],
  providers: [PreparatService],
  exports: [PreparatService],
})
export class PreparatModule {}
