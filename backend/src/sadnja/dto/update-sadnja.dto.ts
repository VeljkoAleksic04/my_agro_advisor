import { PartialType } from '@nestjs/mapped-types';
import { CreateSadnjaDto } from './create-sadnja.dto';

export class UpdateSadnjaDto extends PartialType(CreateSadnjaDto) {}
