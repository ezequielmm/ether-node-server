import { Prop } from '@typegoose/typegoose';
import * as Trinkets from '../trinket/collection';
import { Trinket } from '../trinket/trinket.schema';
import {
    IExpeditionPlayerStateDeckCard,
    PotionInstance,
} from './expedition.interface';
import { GearItem } from '../../../playerGear/gearItem';
import { IPlayerToken } from './expedition.schema';

export class Player {
    @Prop()
    playerId: string;

    @Prop()
    playerToken: IPlayerToken;

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

    @Prop({ type: Object })
    lootboxRarity?: {
        common: number;
        uncommon: number;
        rare: number;
        epic: number;
        legendary: number;
    };

}
