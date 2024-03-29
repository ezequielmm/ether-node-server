import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';
import { IActionHint } from 'src/game/effects/effects.interface';
import { ExpeditionEntity } from '../interfaces';
import { ICombatQueueTarget } from './combatQueue.interface';

@ModelOptions({
    schemaOptions: { collection: 'combatQueue', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class CombatQueue {
    @Prop()
    clientId: string;

    @Prop()
    queue: {
        originType: ExpeditionEntity['type'];
        originId: string;
        targets?: ICombatQueueTarget[];
        action: IActionHint;
    }[];
}
