import { PartialType } from '@nestjs/mapped-types';
import { CreateNavodnjavanjeDto } from './create-navodnjavanje.dto';

export class UpdateNavodnjavanjeDto extends PartialType(CreateNavodnjavanjeDto) {}
