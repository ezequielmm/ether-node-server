import { Prop } from '@typegoose/typegoose';
import { TrinketRarityEnum } from '../trinket.enum';
import { PhoenixEggTrinket } from './phoenix-egg.trinket';

/**
 * Phoenix Egg Upgraded Trinket
 */
export class PhoenixEggUpgradedTrinket extends PhoenixEggTrinket {
    @Prop({ default: 56 })
    trinketId: number;

    @Prop({ default: 'Phoenix Egg+' })
    name: string;

    @Prop({ default: 'At the start of combat, heal 2 hit points' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Rare })
    rarity: TrinketRarityEnum;

    @Prop({ default: 2 })
    hitPointsToAdd: number;
}
