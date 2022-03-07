import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { ExpeditionExistsRule } from '../validators/expeditionExists.rule';

export class CreateExpeditionDto {
    readonly _id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    @Validate(ExpeditionExistsRule)
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
}
