import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateExpeditionDto {
    @ApiProperty({ name: 'player_id' })
    @IsNotEmpty()
    @IsUUID()
    readonly player_id: string;

    @ApiProperty()
    readonly deck: string;

    @ApiProperty()
    readonly map: string;

    @ApiProperty()
    readonly nodes: string;

    @ApiProperty()
    readonly player_state: string;

    @ApiProperty()
    readonly current_state: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly status: string;

    @IsUUID('4', { each: true })
    @ApiProperty()
    readonly trinkets: [string];
}
