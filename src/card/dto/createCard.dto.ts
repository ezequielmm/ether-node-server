import { ApiProperty } from '@nestjs/swagger';
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
    rarity: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    cost: number;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    @MaxLength(255)
    type: string;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    @MaxLength(255)
    keyword: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    coin_cost: number;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    @MaxLength(255)
    status: string;
}
