import { Module } from '@nestjs/common';
import { BiljkaService } from './biljka.service';
import { BiljkaController } from './biljka.controller';
import { NavodnjavanjeModule } from '../navodnjavanje/navodnjavanje.module';

@Module({
  imports: [NavodnjavanjeModule],
  controllers: [BiljkaController],
  providers: [BiljkaService],
  exports: [BiljkaService],
})
export class BiljkaModule {}