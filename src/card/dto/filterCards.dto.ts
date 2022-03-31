import { ApiPropertyOptional } from '@nestjs/swagger';
import { CardClassEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class FilterCards {
    @ApiPropertyOptional({ description: 'Cardpool ID' })
    @IsUUID()
    @IsOptional()
    readonly cardpool_id?: string;

    @ApiPropertyOptional({ description: 'Card Class', enum: CardClassEnum })
    @IsEnum(CardClassEnum)
    @IsOptional()
    readonly card_class?: CardClassEnum;
}
