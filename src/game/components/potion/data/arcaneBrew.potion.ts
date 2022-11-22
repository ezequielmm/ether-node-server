import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { doubleDown } from 'src/game/status/doubleDown/contants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const arcaneBrewPotion: Potion = {
    potionId: 17,
    name: 'Arcane Brew',
    rarity: PotionRarityEnum.Uncommon,
    description: 'Your next attack deals double damage',
    effects: [
        {
            effect: attachStatusEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                statusName: doubleDown.name,
                statusArgs: {
                    counter: 2,
                },
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
    isActive: true,
};
