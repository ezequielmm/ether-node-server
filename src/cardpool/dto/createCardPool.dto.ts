import { ApiProperty } from '@nestjs/swagger';
import { CardpoolVisibilityEnum } from '@prisma/client';
import { IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';
import { UniqueNameOnCardPoolsTable } from 'src/validators/uniqueNameOnCardPoolsTable.rule';

export class CreateCardPoolDto {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(250)
    @UniqueNameOnCardPoolsTable()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsEnum(CardpoolVisibilityEnum)
    @ApiProperty()
    visibility: CardpoolVisibilityEnum;
}
