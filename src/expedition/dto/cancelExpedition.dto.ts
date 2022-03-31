import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CancelExpeditionDto {
    @ApiProperty({ name: 'player_id' })
    @IsNotEmpty()
    @IsUUID()
    readonly player_id: string;
}
