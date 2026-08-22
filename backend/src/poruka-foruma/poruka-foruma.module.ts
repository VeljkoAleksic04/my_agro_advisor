import { Module } from '@nestjs/common';
import { PorukaForumaService } from './poruka-foruma.service';
import { PorukaForumaController } from './poruka-foruma.controller';
import { ObavestenjeModule } from '../obavestenje/obavestenje.module';

@Module({
  imports: [ObavestenjeModule],
  controllers: [PorukaForumaController],
  providers: [PorukaForumaService],
  exports: [PorukaForumaService],
})
export class PorukaForumaModule {}
