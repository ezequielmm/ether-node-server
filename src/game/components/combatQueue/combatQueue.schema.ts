import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExpeditionEntity } from '../interfaces';
import { ICombatQueueTarget } from './combatQueue.interface';

export type CombatQueueDocument = CombatQueue & Document;

@Schema({
    collection: 'combatQueues',
})
export class CombatQueue {
    @Prop()
    clientId: string;

    @Prop()
    queue: {
        originType: ExpeditionEntity['type'];
        originId: string;
        targets?: ICombatQueueTarget[];
    }[];
}

export const CombatQueueSchema = SchemaFactory.createForClass(CombatQueue);
