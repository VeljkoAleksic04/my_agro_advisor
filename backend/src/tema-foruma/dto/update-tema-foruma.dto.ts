import { PartialType } from '@nestjs/mapped-types';
import { CreateTemaForumaDto } from './create-tema-foruma.dto';

export class UpdateTemaForumaDto extends PartialType(CreateTemaForumaDto) {}
