import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { ExpeditionCurrentNodeInterface } from 'src/interfaces/expeditionCurrentNode.interface';
import { ExpeditionMapInterface } from 'src/interfaces/expeditionMap.interface';
import { ExpeditionPlayerStateInterface } from 'src/interfaces/expeditionPlayerState.interface';

@Schema()
export class Expedition {
    @Prop({ type: String, required: true })
    readonly player_id?: string;

    @Prop({ type: Array, required: false })
    readonly map?: ExpeditionMapInterface[];

    @Prop({ type: Object, required: true })
    readonly player_state?: ExpeditionPlayerStateInterface;

    @Prop({ type: Object, required: false })
    readonly current_node?: ExpeditionCurrentNodeInterface;

    @Prop({
        type: String,
        default: ExpeditionStatusEnum.InProgress,
        required: false,
    })
    readonly status?: ExpeditionStatusEnum;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
