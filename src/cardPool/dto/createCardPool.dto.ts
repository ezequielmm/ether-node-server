import { ApiProperty } from '@nestjs/swagger';
import { CardpoolVisibilityEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { UniqueNameOnCardPoolsTable } from 'src/validators/uniqueNameOnCardPoolsTable.validator';

export class CreateCardPoolDto {
    @ApiProperty({ description: 'CardPool Name' })
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(250)
    @UniqueNameOnCardPoolsTable()
    name: string;

    @ApiProperty({
        description: 'Cardpool Visibility',
        enum: CardpoolVisibilityEnum,
        default: CardpoolVisibilityEnum.visible,
    })
    @IsNotEmpty()
    @IsEnum(CardpoolVisibilityEnum)
    visibility: CardpoolVisibilityEnum;
}
