import { randomUUID } from 'crypto';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardTargetedEnum,
} from '../components/card/card.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { damageEffect } from '../effects/damage/constants';
import { regenerate } from '../status/regenerate/contants';
import { CardDescriptionFormatter } from './cardDescriptionFormatter';

describe('Card Description Formatter', () => {
    const effectCard: IExpeditionPlayerStateDeckCard = {
        id: randomUUID(),
        cardId: 1,
        name: 'Attack',
        rarity: CardRarityEnum.Starter,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: `Deal {${damageEffect.name}} Damage`,
        keywords: [],
        properties: {
            effects: [
                {
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 5,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: false,
        isTemporary: false,
    };

    const statusCard: IExpeditionPlayerStateDeckCard = {
        id: randomUUID(),
        cardId: 79,
        name: 'Invoke Blessing',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Power,
        pool: 'knight',
        energy: 1,
        description: `Gain {${regenerate.name}} [${regenerate.name}]`,
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: regenerate.name,
                    args: {
                        attachTo: CardTargetedEnum.Player,
                        value: 1,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: false,
        isTemporary: false,
    };

    it('should update the description with effect value', () => {
        const result = CardDescriptionFormatter.process(effectCard);

        expect(result).toBe('Deal 5 Damage');
    });

    it('should update the description with status value', () => {
        const result = CardDescriptionFormatter.process(statusCard);

        expect(result).toBe('Gain 1 <color=#0066cc>regenerate');
    });
});
