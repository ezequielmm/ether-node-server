import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { AttachedStatus } from '../status/interfaces';

enum TargetEntityEnum {
    Player = 'player',
    Enemy = 'enemy',
}

export interface GetStatusesResponse {
    targetEntity: TargetEntityEnum;
    id: string | number;
    statuses: IStatusesList[];
}

interface IStatusesList {
    name: string;
    counter: number;
    description: string;
}

@Injectable()
export class GetStatusesAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<GetStatusesResponse[]> {
        // First we get the expedition to the player's id and the
        // rest of the information from the current node
        const {
            playerId,
            currentNode: {
                data: {
                    player: {
                        statuses: { buff, debuff },
                    },
                    enemies,
                },
            },
        } = await this.expeditionService.findOne({ clientId });

        // Now we can generate the object that we are, going to return
        const response: GetStatusesResponse[] = [];

        // Add the player information first and its statuses first
        response.push({
            targetEntity: TargetEntityEnum.Player,
            id: playerId,
            statuses: [
                ...this.formatStatusesToArray(buff),
                ...this.formatStatusesToArray(debuff),
            ],
        });

        // Then, we get the enemies and its statuses and add
        // all to the array
        enemies.forEach(({ enemyId, statuses: { buff, debuff } }) => {
            response.push({
                targetEntity: TargetEntityEnum.Enemy,
                id: enemyId,
                statuses: [
                    ...this.formatStatusesToArray(buff),
                    ...this.formatStatusesToArray(debuff),
                ],
            });
        });

        // Finally return the result
        return response;
    }

    private formatStatusesToArray(items: AttachedStatus[]): IStatusesList[] {
        return items.map(({ name, args: { value: counter } }) => {
            return {
                name,
                counter,
                description: this.generateDescription(name, counter),
            };
        });
    }

    private generateDescription(name: string, counter: number): string {
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
                return `“Next turn, all attacks will do double damage`;
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
