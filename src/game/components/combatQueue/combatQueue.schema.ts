import { ModelOptions, Prop } from '@typegoose/typegoose';
import { ExpeditionEntity } from '../interfaces';
import { ICombatQueueTarget } from './combatQueue.interface';

@ModelOptions({
    schemaOptions: { collection: 'combatQueue', versionKey: false },
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
