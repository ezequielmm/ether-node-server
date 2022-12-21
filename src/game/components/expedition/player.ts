import { Prop } from '@typegoose/typegoose';
import * as Trinkets from '../trinket/collection';
import { Trinket } from '../trinket/trinket.schema';
import {
    IExpeditionPlayerStateDeckCard,
    PotionInstance,
} from './expedition.interface';

export class Player {
    @Prop()
    playerId: string;

    @Prop()
    playerName: string;

    @Prop()
    characterClass: string;

    @Prop()
    hpMax: number;

    @Prop()
    hpCurrent: number;

    @Prop()
    gold: number;

    @Prop()
    potions: PotionInstance[];

    @Prop({
        type: Trinket,
        discriminators: () => Object.values(Trinkets),
    })
    trinkets: Trinket[];

    @Prop()
    createdAt: Date;

    @Prop()
    cards: IExpeditionPlayerStateDeckCard[];

    @Prop()
    stoppedAt?: Date;

    @Prop()
    cardUpgradeCount: number;

    @Prop()
    cardDestroyCount: number;
}
