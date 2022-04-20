import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { ExpeditionCurrentNodeInterface } from 'src/interfaces/expeditionCurrentNode.interface';
import { ExpeditionMapInterface } from 'src/interfaces/expeditionMap.interface';
import { ExpeditionPlayerStateInterface } from 'src/interfaces/expeditionPlayerState.interface';

@Schema()
export class Expedition {
    @Prop({ type: String })
    readonly client_id?: string;

    @Prop({ type: String })
    readonly player_id?: string;

    @Prop({ type: Array })
    readonly map?: ExpeditionMapInterface[];

    @Prop({ type: Object })
    readonly player_state?: ExpeditionPlayerStateInterface;

    @Prop({ type: Object })
    readonly current_node?: ExpeditionCurrentNodeInterface;

    @Prop({
        type: String,
        default: ExpeditionStatusEnum.InProgress,
    })
    readonly status?: ExpeditionStatusEnum;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
