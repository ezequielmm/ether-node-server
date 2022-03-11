import { ApiProperty } from '@nestjs/swagger';
import {
    CardKeywordEnum,
    CardRarityEnum,
    CardStatusEnum,
    CardTypeEnum,
} from '@prisma/client';
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
