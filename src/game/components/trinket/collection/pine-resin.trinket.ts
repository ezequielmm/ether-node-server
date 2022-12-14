import { Prop } from '@typegoose/typegoose';
import { damageEffect } from 'src/game/effects/damage/constants';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { StatusDirection, StatusType } from 'src/game/status/interfaces';
import { TrinketModifier } from '../trinket-modifier';
import { TrinketRarityEnum } from '../trinket.enum';

/**
 * Pine Resin Trinket
 */
export class PineResinTrinket extends TrinketModifier {
    @Prop({ default: 2 })
    trinketId: number;

    @Prop({ default: 'Pine Resin' })
    name: string;

    @Prop({
        default: 'When taking unblocked attack damage, reduce damage by 1',
    })
    description: string;

    @Prop({ default: TrinketRarityEnum.Common })
    rarity: TrinketRarityEnum;

    @Prop({ default: StatusType.Buff })
    type: StatusType;

    @Prop({ default: StatusDirection.Incoming })
    direction: StatusDirection;

    @Prop({ default: damageEffect.name })
    effect: string;

    mutate(dto: EffectDTO): EffectDTO {
        if (dto.target.type == 'player') {
            if (dto.target.value.combatState.defense == 0) {
                dto.args.currentValue -= 1;
                this.trigger(dto.ctx);
            }
        }

        return dto;
    }
}
