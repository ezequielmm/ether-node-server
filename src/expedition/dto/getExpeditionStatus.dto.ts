import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetExpeditionStatus {
    @ApiProperty({ name: 'player_id' })
    @IsNotEmpty()
    @IsUUID()
    readonly player_id: string;
}
