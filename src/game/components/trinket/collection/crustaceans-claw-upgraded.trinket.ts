import { Prop } from '@typegoose/typegoose';
import { TrinketRarityEnum } from '../trinket.enum';
import { CrustaceansClawTrinket } from './crustaceans-claw.trinket';

/**
 * Crustacean's Claw Upgraded Trinket
 */
export class CrustaceansClawUpgradedTrinket extends CrustaceansClawTrinket {
    @Prop({ default: 14 })
    trinketId: number;

    @Prop({ default: "Crustacean's Claw+" })
    name: string;

    @Prop({
        default:
            'At the beginning of combat, draw 2 extra card, which costs 0 this turn',
    })
    description: string;

    @Prop({ default: TrinketRarityEnum.Uncommon })
    rarity: TrinketRarityEnum;

    @Prop({ default: 2 })
    cardsToDraw: number;
}
