import { Module } from '@nestjs/common';
import { ObavestenjeController } from './obavestenje.controller';
import { ObavestenjeService } from './obavestenje.service';

@Module({
  controllers: [ObavestenjeController],
  providers: [ObavestenjeService],
  exports: [ObavestenjeService],
})
export class ObavestenjeModule {}
