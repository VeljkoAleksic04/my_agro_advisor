import { PartialType } from '@nestjs/mapped-types';
import { CreateTretmanDto } from './create-tretman.dto';

export class UpdateTretmanDto extends PartialType(CreateTretmanDto) {}
