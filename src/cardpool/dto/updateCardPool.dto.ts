import { PartialType } from '@nestjs/mapped-types';
import { CreateCardPoolDto } from './createCardPool.dto';

export class UpdateCardPoolDto extends PartialType(CreateCardPoolDto) {}
