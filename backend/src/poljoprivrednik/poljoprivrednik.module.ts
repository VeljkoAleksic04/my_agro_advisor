import { Module } from '@nestjs/common';
import { PoljoprivrednikService } from './poljoprivrednik.service';
import { PoljoprivrednikController } from './poljoprivrednik.controller';

@Module({
  controllers: [PoljoprivrednikController],
  providers: [PoljoprivrednikService],
})
export class PoljoprivrednikModule {}
