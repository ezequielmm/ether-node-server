import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CombatQueueOriginTypeEnum } from './combatQueue.enum';
import { ICombatQueueTarget } from './combatQueue.interface';

export type CombatQueueDocument = CombatQueue & Document;

@Schema({
    collection: 'combatQueues',
})
export class CombatQueue {
    @Prop()
    clientId: string;

    @Prop()
    originType: CombatQueueOriginTypeEnum;

    @Prop()
    originId: string;

    @Prop({ type: Object })
    targets?: ICombatQueueTarget[];
}

export const CombatQueueSchema = SchemaFactory.createForClass(CombatQueue);
