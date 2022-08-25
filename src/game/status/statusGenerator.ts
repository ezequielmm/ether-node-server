import { AttachedStatus } from './interfaces';

export interface IStatusesList {
    name: string;
    counter: number;
    description: string;
}

export class StatusGenerator {
    static formatStatusesToArray(items: AttachedStatus[]): IStatusesList[] {
        return items.map(({ name, args: { value: counter } }) => {
            return {
                name,
                counter,
                description: this.generateDescription(name, counter),
            };
        });
    }

    private static generateDescription(name: string, counter: number): string {
        switch (name) {
            case 'resolve':
                return `Burn does ${counter} points of damage at the end of each round`;
            case 'confusion':
                return `For ${counter} turns, all actions will be redirected to random targets`;
            case 'dodge':
                return `The next ${counter} attacks against this character will be reduced to 0 damage`;
            case 'doubleDown':
                return `Your next Attack card damage will be multiplied by ${counter}`;
            case 'fortitude':
                return `Defense cards gain ${counter} additional points`;
            case 'heraldDelayed':
                return `Next turn, all attacks will do double damage`;
            case 'imbued':
                return `The next card you play will trigger twice`;
            case 'regenerate':
                return `At the start of each turn, heal ${counter} HP`;
            case 'siphoning':
                return `Until the end of this turn, gain Defense points equal to Attack damage dealt.`;
            case 'spikes':
                return `Each attack against this character deals ${counter} damage to the attacker`;
            case 'spirited':
                return `Next turn, gain ${counter} Energy points`;
            case 'tasteOfBlood:buff':
            case 'tasteOfBlood:debuff':
                return `All attacks by and against you will do double damage`;
            case 'turtling':
                return `Double the effect of all Defense gained from cards`;
            default:
                return `Unknown Intentions`;
        }
    }
}
