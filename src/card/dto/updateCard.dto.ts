import { ApiProperty } from '@nestjs/swagger';
import {
    CardKeywordEnum,
    CardRarityEnum,
    CardStatusEnum,
    CardTypeEnum,
} from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCardDto {
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsEnum(CardRarityEnum)
    @ApiProperty({ enum: CardRarityEnum })
    rarity: CardRarityEnum;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    cost: number;

    @IsNotEmpty()
    @IsEnum(CardTypeEnum)
    @ApiProperty({ enum: CardTypeEnum })
    type: CardTypeEnum;

    @IsNotEmpty()
    @IsEnum(CardKeywordEnum)
    @ApiProperty({ enum: CardKeywordEnum })
    keyword: CardKeywordEnum;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    coin_cost: number;

    @IsNotEmpty()
    @IsEnum(CardStatusEnum)
    @ApiProperty({ enum: CardStatusEnum })
    status: CardStatusEnum;
}
