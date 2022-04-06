import { ApiProperty } from '@nestjs/swagger';
import { CardpoolVisibilityEnum } from '@prisma/client';
import { IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateCardPoolDto {
    @ApiProperty({ description: 'CardPool Name' })
    @IsOptional()
    @MinLength(1)
    @MaxLength(250)
    name?: string;

    @ApiProperty({
        description: 'Cardpool Visibility',
        enum: CardpoolVisibilityEnum,
    })
    @IsOptional()
    @IsEnum(CardpoolVisibilityEnum)
    visibility?: CardpoolVisibilityEnum;
}
