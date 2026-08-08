import { PartialType } from '@nestjs/mapped-types';
import { CreateBiljkaDto } from './create-biljka.dto';

export class UpdateBiljkaDto extends PartialType(CreateBiljkaDto) {}
