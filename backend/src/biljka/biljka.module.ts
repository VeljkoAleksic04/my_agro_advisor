import { Module } from '@nestjs/common';
import { BiljkaService } from './biljka.service';
import { BiljkaController } from './biljka.controller';

@Module({
  controllers: [BiljkaController],
  providers: [BiljkaService],
  exports: [BiljkaService],
})
export class BiljkaModule {}
