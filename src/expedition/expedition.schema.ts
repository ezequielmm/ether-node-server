import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { ExpeditionCurrentNodeInterface } from 'src/interfaces/expeditionCurrentNode.interface';
import { ExpeditionPlayerStateInterface } from 'src/interfaces/ExpeditionPlayerState.interface';

@Schema()
export class Expedition {
    @Prop({ required: true })
    readonly player_id: string;

    @Prop({ type: Object, default: {}, required: false })
    readonly deck?: object;

    @Prop({ type: Object, default: {}, required: false })
    readonly map?: object;

    @Prop({ type: Object, required: true })
    readonly player_state: ExpeditionPlayerStateInterface;

    @Prop({ type: Object, required: false })
    readonly current_node?: ExpeditionCurrentNodeInterface;

    @Prop({ type: Array, default: [], required: false })
    readonly trinkets?: [];

    @Prop({ default: ExpeditionStatusEnum.InProgress, required: false })
    readonly status: ExpeditionStatusEnum;
}

export const ExpeditionSchema = SchemaFactory.createForClass(Expedition);
