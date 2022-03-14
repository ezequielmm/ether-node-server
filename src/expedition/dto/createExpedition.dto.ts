import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ExpeditionExists } from '../../validators/expeditionExists.rule';

export class CreateExpeditionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    @ExpeditionExists()
    readonly player_id: string;
}
