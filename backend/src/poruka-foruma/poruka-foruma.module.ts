import { Module } from '@nestjs/common';
import { PorukaForumaService } from './poruka-foruma.service';
import { PorukaForumaController } from './poruka-foruma.controller';

@Module({
  controllers: [PorukaForumaController],
  providers: [PorukaForumaService],
  exports: [PorukaForumaService],
})
export class PorukaForumaModule {}
