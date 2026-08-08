import { Module } from '@nestjs/common';
import { TretmanService } from './tretman.service';
import { TretmanController } from './tretman.controller';

@Module({
  controllers: [TretmanController],
  providers: [TretmanService],
  exports: [TretmanService],
})
export class TretmanModule {}
