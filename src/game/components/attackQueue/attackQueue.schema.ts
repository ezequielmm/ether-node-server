import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AttackQueueOriginTypeEnum } from './attackQueue.enum';
import { IAttackQueueTarget } from './attackQueue.interface';
import { Document } from 'mongoose';

export type AttackQueueDocument = AttackQueue & Document;

@Schema({
    collection: 'attackQueues',
})
export class AttackQueue {
    @Prop()
    expeditionId: string;

    @Prop()
    originType: AttackQueueOriginTypeEnum;

    @Prop()
    originId: string;

    @Prop({ type: Object })
    targets?: IAttackQueueTarget[];
}

export const AttackQueueSchema = SchemaFactory.createForClass(AttackQueue);
