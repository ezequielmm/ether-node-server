import { addCardEffect } from './addCard/contants';
import { damageEffect } from './damage/constants';
import { defenseEffect } from './defense/constants';
import { drawCardEffect } from './drawCard/constants';
import { energyEffect } from './energy/constants';
import { flurry, flurryPlus } from './flurry/constants';
import { healEffect } from './heal/constants';

export class EffectGenerator {
    public static generateDescription(name: string, value?: number): string {
        switch (name) {
            case damageEffect.name:
                return `This card will attack for ${value} damage`;
            case defenseEffect.name:
                return `This card will add ${value} defense points to the player`;
            case addCardEffect.name:
                return `This card will add ${value} cards to the hand`;
            case drawCardEffect.name:
                return `This card will draw ${value} cards form the draw pile`;
            case energyEffect.name:
                return `This card will add ${value} energy points`;
            case flurry.name:
                return `This card will deal ${value} damage X times to random enemies`;
            case flurryPlus.name:
                return `This card will deal ${value} damage X + 1 times to random enemies`;
            case healEffect.name:
                return `This card will heal ${value} HP to the player`;
            default:
                return 'Unknown effect';
        }
    }
}
