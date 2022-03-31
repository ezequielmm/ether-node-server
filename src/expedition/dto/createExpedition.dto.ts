import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateExpeditionDto {
    @ApiProperty({ name: 'player_id' })
    @IsNotEmpty()
    @IsUUID()
    readonly player_id: string;

    @ApiProperty({ name: 'character_id' })
    @IsEmpty()
    @IsUUID()
    readonly character_id?: string;
}
