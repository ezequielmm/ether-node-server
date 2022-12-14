import { bolstered } from './bolstered/constants';
import { burn } from './burn/constants';
import { confusion } from './confusion/constants';
import { dewDropStatus } from './dewDrop/constants';
import { dodge } from './dodge/constants';
import { doubleDown } from './doubleDown/contants';
import { fatigue } from './fatigue/constants';
import { feebleStatus } from './feeble/constants';
import { fortitude } from './fortitude/constants';
import { gifted } from './gifted/constants';
import { heraldDelayedStatus } from './heraldDelayed/constants';
import { heraldingStatus } from './heralding/constants';
import { imbued } from './imbued/constants';
import { intercept } from './intercept/constants';
import { AttachedStatus } from './interfaces';
import { regeneration } from './regeneration/contants';
import { resolveStatus } from './resolve/constants';
import { siphoning } from './siphoning/constants';
import { spikesStatus } from './spikes/constants';
import { spirited } from './spirited/contants';
import { tasteOfBloodBuff, tasteOfBloodDebuff } from './tasteOfBlood/constants';
import { trapped } from './trapped/constants';
import { turtling } from './turtling/constants';

export interface IStatusesList {
    name: string;
    counter: number;
    description: string;
}

export class StatusGenerator {
    static formatStatusesToArray(items: AttachedStatus[]): IStatusesList[] {
        return items.map(({ name, args: { counter: counter } }) => {
            let newName = name;

            switch (name) {
                case tasteOfBloodBuff.name:
                case tasteOfBloodDebuff.name:
                    newName = 'tasteOfBlood';
                    break;
                default:
                    newName = name;
            }

            return {
                name: newName,
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
            case tasteOfBloodBuff.name:
            case tasteOfBloodDebuff.name:
                return `All attacks by and against you will do double damage`;
            case turtling.name:
                return `Double the effect of all Defense gained from cards`;
            case heraldingStatus.name:
                return `All attacks this turn will do double damage`;
            case trapped.name:
                return `The enemy is hiding and waiting to strike`;
            case burn.name:
                return `Burn does ${counter} points of damage at the end of each turn`;
            case feebleStatus.name:
                return `All Defend actions gain 25% less Defense`;
            case fatigue.name:
                return `All attacks by this character do 25% less damage`;
            case dewDropStatus.name:
                return `The first card played each round will cost 1 less Energy`;
            case intercept.name:
                return `All attacks against this character do half damage while active`;
            case bolstered.name:
                return `Until the end of the turn, gain ${counter} Defense for every card you play`;
            case gifted.name:
                return `Gain ${counter} Defense at the start of each round`;
            default:
                return `Unknown status`;
        }
    }
}
