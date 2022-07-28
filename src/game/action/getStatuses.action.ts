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
                return `For ${counter} turn, all actions will be redirected to random targets`;
            default:
                return `Unknown Intentions`;
        }
    }
}
