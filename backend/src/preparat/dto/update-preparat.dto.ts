import { PartialType } from '@nestjs/mapped-types';
import { CreatePreparatDto } from './create-preparat.dto';

export class UpdatePreparatDto extends PartialType(CreatePreparatDto) {}
