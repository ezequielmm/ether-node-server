import { damageEffect } from './damage/constants';

export class EffectGenerator {
    public static generateDescription(name: string, value?: number): string {
        switch (name) {
            case damageEffect.name:
                return `This card will attack for ${value} damage`;
            default:
                return 'Unknown effect';
        }
    }
}
