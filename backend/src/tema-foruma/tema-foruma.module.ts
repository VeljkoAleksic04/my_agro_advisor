import { Module } from '@nestjs/common';
import { TemaForumaService } from './tema-foruma.service';
import { TemaForumaController } from './tema-foruma.controller';

@Module({
  controllers: [TemaForumaController],
  providers: [TemaForumaService],
  exports: [TemaForumaService],
})
export class TemaForumaModule {}
