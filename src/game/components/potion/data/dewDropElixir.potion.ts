import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { dewDropStatus } from 'src/game/status/dewDrop/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const dewDropElixirPotion: Potion = {
    potionId: 15,
    name: 'Dew Drop Elixir',
    rarity: PotionRarityEnum.Rare,
    description: 'The first card you play each turn costs 1 less Energy',
    effects: [
        {
            effect: attachStatusEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                statusName: dewDropStatus.name,
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
};
