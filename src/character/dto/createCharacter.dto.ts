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

export class CreateCharacterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(250)
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
    cardpool_id: string;
}
