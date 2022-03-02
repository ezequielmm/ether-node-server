import { ApiProperty } from '@nestjs/swagger';
import { CardKeywords, CardRarity, CardStatus, CardType } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCardDto {
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    rarity: CardRarity;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    cost: number;

    @IsNotEmpty()
    @ApiProperty()
    type: CardType;

    @IsNotEmpty()
    @ApiProperty()
    keyword: CardKeywords;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    coin_cost: number;

    @IsNotEmpty()
    @ApiProperty()
    status: CardStatus;
}
