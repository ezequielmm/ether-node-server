import { IsEmpty, IsNotEmpty, IsUUID } from 'class-validator';
import { ExpeditionStatus } from '../expedition.schema';

export class CreateExpeditionDto {
    @IsNotEmpty()
    @IsUUID()
    readonly player_id: string;

    readonly deck?: object;

    readonly map?: object;

    readonly nodes?: object;

    readonly player_state?: object;

    readonly current_state?: object;

    @IsNotEmpty()
    readonly status?: ExpeditionStatus;

    @IsUUID('4', { each: true })
    readonly trinkets?: [];

    @IsEmpty()
    @IsUUID()
    readonly character_id?: string;
}
