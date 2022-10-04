import { energyEffect } from 'src/game/effects/energy/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const ichorDraft: Potion = {
    potionId: 4,
    name: 'Ichor Draft Potion',
    rarity: PotionRarityEnum.Common,
    description: 'Gain 2 Energy',
    effects: [
        {
            effect: energyEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                value: 2,
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
};
