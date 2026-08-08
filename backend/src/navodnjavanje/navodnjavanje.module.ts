import { Module } from '@nestjs/common';
import { NavodnjavanjeService } from './navodnjavanje.service';
import { NavodnjavanjeController } from './navodnjavanje.controller';

@Module({
  controllers: [NavodnjavanjeController],
  providers: [NavodnjavanjeService],
  exports: [NavodnjavanjeService],
})
export class NavodnjavanjeModule {}
