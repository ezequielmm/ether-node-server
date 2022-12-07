import { confusion } from './confusion/constants';
import { dodge } from './dodge/constants';
import { doubleDown } from './doubleDown/contants';
import { fortitude } from './fortitude/constants';
import { heraldDelayedStatus } from './heraldDelayed/constants';
import { heraldingStatus } from './heralding/constants';
import { imbued } from './imbued/constants';
import { AttachedStatus } from './interfaces';
import { regeneration } from './regeneration/contants';
import { resolveStatus } from './resolve/constants';
import { siphoning } from './siphoning/constants';
import { spikesStatus } from './spikes/constants';
import { spirited } from './spirited/contants';
import { turtling } from './turtling/constants';

export interface IStatusesList {
    name: string;
    counter: number;
    description: string;
}

export class StatusGenerator {
    static formatStatusesToArray(items: AttachedStatus[]): IStatusesList[] {
        return items.map(({ name, args: { counter: counter } }) => {
            return {
                name,
                counter,
                description: this.generateDescription(name, counter),
            };
        });
    }

    public static generateDescription(name: string, counter: number): string {
        // TODO Add description property to status type and remove this switch
        switch (name) {
            case resolveStatus.name:
                return `Increases all Attack damage by ${counter} per instance`;
            case confusion.name:
                return `For ${counter} turns, all actions will be redirected to random targets`;
            case dodge.name:
                return `The next ${counter} attacks against this character will be reduced to 0 damage`;
            case doubleDown.name:
                return `Your next Attack card damage will be multiplied by ${counter}`;
            case fortitude.name:
                return `Defense cards gain ${counter} additional points`;
            case heraldDelayedStatus.name:
                return `Next turn, all attacks will do double damage`;
            case imbued.name:
                return `The next card you play will trigger twice`;
            case regeneration.name:
                return `At the start of each turn, heal ${counter} HP`;
            case siphoning.name:
                return `Until the end of this turn, gain Defense points equal to Attack damage dealt.`;
            case spikesStatus.name:
                return `Each attack against this character deals ${counter} damage to the attacker`;
            case spirited.name:
                return `Next turn, gain ${counter} Energy points`;
            case 'tasteOfBlood':
                return `All attacks by and against you will do double damage`;
            case turtling.name:
                return `Double the effect of all Defense gained from cards`;
            case heraldingStatus.name:
                return `All attacks this turn will do double damage`;
            default:
                return `Unknown status`;
        }
    }
}
