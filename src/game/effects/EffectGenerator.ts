import { addCardEffect } from './addCard/contants';
import { damageEffect } from './damage/constants';
import { defenseEffect } from './defense/constants';

export class EffectGenerator {
    public static generateDescription(name: string, value?: number): string {
        switch (name) {
            case damageEffect.name:
                return `This card will attack for ${value} damage`;
            case defenseEffect.name:
                return `This card will add ${value} defense points to the player`;
            case addCardEffect.name:
                return `This will add ${value} cards to the hand`;
            default:
                return 'Unknown effect';
        }
    }
}
