import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { resolveExpiresStatus } from 'src/game/status/resolveExpires/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const flaskOfResolvePotion: Potion = {
    potionId: 13,
    name: 'Flask of Resolve',
    rarity: PotionRarityEnum.Common,
    description: 'Gain 5 Resolve, lose 5 Resolve at end of turn',
    effects: [
        {
            effect: attachStatusEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                statusName: resolveStatus.name,
                statusArgs: {
                    counter: 5,
                },
            },
        },
        {
            effect: attachStatusEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                statusName: resolveExpiresStatus.name,
                statusArgs: {
                    counter: 5,
                },
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
};
