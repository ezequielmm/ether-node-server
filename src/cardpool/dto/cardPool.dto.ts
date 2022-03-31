import { ApiProperty } from '@nestjs/swagger';
import { CardpoolVisibilityEnum } from '@prisma/client';

export class CardPoolDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    visibility: CardpoolVisibilityEnum;
    @ApiProperty()
    created_at: Date;
}
