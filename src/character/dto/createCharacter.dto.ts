import { ApiProperty } from '@nestjs/swagger';
import { CharacterClassEnum } from '@prisma/client';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsUUID,
    MaxLength,
    MinLength,
} from 'class-validator';
import { UniqueNameOnCharactersTable } from 'src/validators/uniqueNameOnCharactersTable.rule';

export class CreateCharacterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(250)
    @UniqueNameOnCharactersTable()
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @IsNotEmpty()
    @IsEnum(CharacterClassEnum)
    @ApiProperty({ enum: CharacterClassEnum })
    class: string;

    @IsNumber()
    @ApiProperty()
    initial_health: number;

    @IsNumber()
    @ApiProperty()
    initial_gold: number;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    cardpool_id: string;
}
