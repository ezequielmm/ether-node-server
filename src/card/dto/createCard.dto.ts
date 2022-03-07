import { ApiProperty } from '@nestjs/swagger';
import { CardKeywords, CardRarity, CardStatus, CardType } from '@prisma/client';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsUUID,
    MaxLength,
    MinLength,
} from 'class-validator';
import { CharacterClassExists } from 'src/validators/characterClassExists.rule';
import { UniqueCodeOnCardsTable } from 'src/validators/uniqueCodeOnCardsTable.rule';
import { UniqueNameOnCardsTable } from 'src/validators/uniqueNameOnCardsTable.rule';

export class CreateCardDto {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(250)
    @UniqueNameOnCardsTable()
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @UniqueCodeOnCardsTable()
    @ApiProperty()
    code: string;

    @IsNotEmpty()
    @IsUUID()
    @CharacterClassExists()
    @ApiProperty()
    character_class_id: string;

    @IsNotEmpty()
    @IsEnum(CardRarity)
    @ApiProperty({ enum: CardRarity })
    rarity: CardRarity;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    cost: number;

    @IsNotEmpty()
    @IsEnum(CardType)
    @ApiProperty({ enum: CardType })
    type: CardType;

    @IsNotEmpty()
    @IsEnum(CardKeywords)
    @ApiProperty({ enum: CardKeywords })
    keyword: CardKeywords;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    coin_cost: number;

    @IsNotEmpty()
    @IsEnum(CardStatus)
    @ApiProperty({ enum: CardStatus })
    status: CardStatus;
}
