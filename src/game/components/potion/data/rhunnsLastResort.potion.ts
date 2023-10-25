import { rhunnsLastResortEffect } from "src/game/effects/rhunnsLastResort/constants";
import { PotionRarityEnum, PotionTargetEnum } from "../potion.enum";
import { Potion } from "../potion.schema";

export const rhunnsLastResort: Potion = {
    potionId: 26,
    name: 'Rhunn’s Last Resort',
    rarity: PotionRarityEnum.Common,
    description: 'Receive random (1- 50) damage. Then, if survived, swap hp with a random enemy.',
    effects: [
        {
            effect: rhunnsLastResortEffect.name,
            target: PotionTargetEnum.RandomEnemy,
            args: {
                minDamage: 1,
                maxDamage: 50,
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
    isActive: true,
};