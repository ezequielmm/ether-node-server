import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { filter } from 'lodash';
import { thornWolfData } from 'src/game/components/enemy/data/thornWolf.enemy';
import { thornWolfPupData } from 'src/game/components/enemy/data/thornWolfPup.enemy';
import { EnemyCategoryEnum } from 'src/game/components/enemy/enemy.enum';
import { IExpeditionCurrentNodeDataEnemy } from 'src/game/components/expedition/expedition.interface';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { summoned } from './constants';

interface SummonedData {
    enemy: IExpeditionCurrentNodeDataEnemy;
}

@StatusDecorator({
    status: summoned,
})
@Injectable()
export class SummonedStatus implements StatusEventHandler {
    constructor(
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(dto: StatusEventDTO<SummonedData>): Promise<void> {
        const {
            ctx,
            eventArgs: { enemy },
        } = dto;

        console.log(dto);

        // First we check if the enemy that died is an elite, otherwise we exit
        // the status
        if (enemy.category !== EnemyCategoryEnum.Elite) return;

        // Now we get the enemies that we have on the current node data
        const {
            expedition: {
                currentNode: {
                    data: { enemies },
                },
            },
        } = ctx;

        // Now we check if we have the enemy minions on combat with
        // the summoning status
        const enemyMinions = this.getEnemyMinions(enemy.enemyId);

        if (enemyMinions.length === 0) return;

        const minionsToRemove = filter(enemies, (enemy) => {
            return (
                enemy.hpCurrent > 0 &&
                enemyMinions.includes(enemy.enemyId) &&
                enemy.statuses.debuff.some(
                    (status) => status.name === SummonedStatus.name,
                )
            );
        });

        // Now that we know the minions with the right status, we remove them
        // from the enemies array and send a new message to the frontend, but only
        // if we have at least one minion
        if (minionsToRemove.length > 0) {
            await this.expeditionService.updateByFilter(
                {
                    clientId: ctx.client.id,
                },
                {
                    $set: {
                        'currentNode.data.enemies': [],
                    },
                },
            );
        }
    }

    private getEnemyMinions(enemyId: number): number[] {
        switch (enemyId) {
            case thornWolfData.enemyId:
                return this.getThornWolfPupsIds();
            default:
                return [];
        }
    }

    private getThornWolfPupsIds = (): number[] => [thornWolfPupData.enemyId];
}
