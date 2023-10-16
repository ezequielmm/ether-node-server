import { Prop } from "@typegoose/typegoose";
import { TrinketRarityEnum } from "../trinket.enum";
import { TrinketModifier } from "../trinket-modifier";
import { damageEffect } from "src/game/effects/damage/constants";
import { StatusType, StatusDirection } from "src/game/status/interfaces";
import { EffectDTO } from "src/game/effects/effects.interface";

/**
 * New Trinket
 */
export class TalismanOfQuakeTrinket extends TrinketModifier {

    @Prop({ default: 60 })
    trinketId: number;

    @Prop({ default: 'Talisman of Quake' })
    name: string;

    @Prop({ default: 'Any attack that deals 20+ damage to any enemy, deals an additional 5 damage to all enemies.' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Common })
    rarity: TrinketRarityEnum;

    @Prop({ default: 20 })
    minDamage: number;

    @Prop({ default: 5 })
    damageIncrement: number;

    @Prop({ default: StatusType.Buff })
    type: StatusType;

    @Prop({ default: StatusDirection.Outgoing })
    direction: StatusDirection;

    @Prop({ default: damageEffect.name })
    effect: string;

    mutate(dto: EffectDTO): EffectDTO {
        if (dto.target.type == 'enemy') {
            if (dto.args.currentValue >= this.minDamage) {
                dto.args.currentValue += this.damageIncrement;
                this.trigger(dto.ctx);
            }
        }

        return dto;
    }
}