import { ApiProperty } from '@nestjs/swagger';
import { CardpoolVisibilityEnum } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class GetCardPoolsDto {
    @ApiProperty({ description: 'CardPool name' })
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'CardPool Visibility',
        enum: CardpoolVisibilityEnum,
    })
    @IsOptional()
    visibility?: CardpoolVisibilityEnum;
}
