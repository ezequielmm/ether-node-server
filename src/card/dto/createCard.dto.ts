import { ApiProperty } from '@nestjs/swagger';
import { CardKeywords, CardRarity, CardStatus, CardType } from '@prisma/client';
import {
    IsNotEmpty,
    IsNumber,
    IsUUID,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateCardDto {
    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    @MaxLength(250)
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    code: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    character_class_id: string;

    @ApiProperty()
    rarity: CardRarity;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    cost: number;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    @MaxLength(255)
    type: CardType;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    @MaxLength(255)
    keyword: CardKeywords;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    coin_cost: number;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    @MaxLength(255)
    status: CardStatus;
}
