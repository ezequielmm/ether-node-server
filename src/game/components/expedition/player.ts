import { Prop } from '@typegoose/typegoose';
import * as Trinkets from '../trinket/collection';
import { Trinket } from '../trinket/trinket.schema';
import {
    IExpeditionPlayerStateDeckCard,
    PotionInstance,
} from './expedition.interface';
import { GearItem } from '../../../playerGear/gearItem';

export class Player {
    @Prop()
    playerId: string;

    @Prop()
    nftId?: number;

    @Prop()
    equippedGear?: GearItem[];

    @Prop()
    playerName: string;

    @Prop()
    email?: string;

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
    cards: IExpeditionPlayerStateDeckCard[];

    @Prop()
    cardUpgradeCount: number;

    @Prop()
    cardDestroyCount: number;

    @Prop()
    gear: any[];
}
