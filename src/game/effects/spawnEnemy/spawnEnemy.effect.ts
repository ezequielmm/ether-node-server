import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { map } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { ExpeditionStatusEnum } from 'src/game/components/expedition/expedition.enum';
import { IExpeditionCurrentNodeDataEnemy } from 'src/game/components/expedition/expedition.interface';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { StatusType } from 'src/game/status/interfaces';
import { getRandomBetween } from 'src/utils';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { spawnEnemyEffect } from './contants';

export interface SpawnEnemyArgs {
    enemiesToSpawn: number[];
}

@EffectDecorator({
    effect: spawnEnemyEffect,
})
@Injectable()
export class SpawnEnemyEffect implements EffectHandler {
    constructor(
        private readonly enemyService: EnemyService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(dto: EffectDTO<SpawnEnemyArgs>): Promise<void> {
        const {
            ctx,
            args: { enemiesToSpawn },
        } = dto;

        // First we check the enemies that we are going to spawn in
        // during combat and get their information from the database
        const enemiesFromDB = await this.enemyService.findEnemiesById(
            enemiesToSpawn,
        );

        // Now if we find enemies, we add them to the combat state and send a new message
        // To the frontend so they can show the proper animations
        if (enemiesFromDB.length > 0) {
            // Here we add the enemies to the enemies array on the current state object
            const {
                expedition: {
                    currentNode: {
                        data: { enemies },
                    },
                },
            } = ctx;

            const enemiesToAdd: IExpeditionCurrentNodeDataEnemy[] = map(
                enemiesFromDB,
                (enemy) => {
                    const newHealth = getRandomBetween(
                        enemy.healthRange[0],
                        enemy.healthRange[1],
                    );

                    return {
                        id: randomUUID(),
                        enemyId: enemy.enemyId,
                        name: enemy.name,
                        category: enemy.category,
                        type: enemy.type,
                        size: enemy.size,
                        defense: 0,
                        hpCurrent: newHealth,
                        hpMax: newHealth,
                        statuses: {
                            [StatusType.Buff]: [],
                            [StatusType.Debuff]: [],
                        },
                    };
                },
            );

            enemies.push(...enemiesToAdd);

            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.SpawnEnemies,
                    data: { enemies: enemiesToAdd },
                }),
            );

            await this.expeditionService.updateByFilter(
                {
                    clientId: ctx.client.id,
                    status: ExpeditionStatusEnum.InProgress,
                },
                { $set: { 'currentNode.data.enemies': enemies } },
            );
        }
    }
}
