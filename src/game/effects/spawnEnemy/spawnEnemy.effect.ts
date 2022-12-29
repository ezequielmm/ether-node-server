import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { includes, map, some } from 'lodash';
import { Socket } from 'socket.io';
import { blueSporelingData } from 'src/game/components/enemy/data/blueSporeling.enemy';
import { fungalBruteData } from 'src/game/components/enemy/data/fungalBrute.enemy';
import { redSporelingData } from 'src/game/components/enemy/data/redSporeling.enemy';
import { yellowSporelingData } from 'src/game/components/enemy/data/yellowSporeling.enemy';
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
            ctx: {
                expedition: {
                    currentNode: {
                        data: { enemies },
                    },
                },
            },
            args: { enemiesToSpawn },
        } = dto;

        // First we check if the current combat has any sporelings alive,
        // only spawn in when there are no sporelings (this is temporary)
        // and the enemy is a fungalbrute
        const combatHasFungalBrute = some(enemies, {
            enemyId: fungalBruteData.enemyId,
        });

        if (combatHasFungalBrute) {
            // Now if we have a fungal brute, we check if we have any sporelings alive
            const combatHasSporelings = combatHasFungalBrute
                ? some(enemies, (enemy) => {
                      const sporelingsIds = this.getSporelingsIds();
                      return (
                          enemy.hpCurrent > 0 &&
                          includes(sporelingsIds, enemy.enemyId)
                      );
                  })
                : false;

            // We only need to add new sporelings if there are no more alive

            if (combatHasSporelings)
                await this.spawnEnemies(enemiesToSpawn, enemies, ctx.client);

            console.log({ combatHasFungalBrute, combatHasSporelings });
        } else {
            await this.spawnEnemies(enemiesToSpawn, enemies, ctx.client);
        }
    }

    private async spawnEnemies(
        enemiesToSpawn: number[],
        enemies: IExpeditionCurrentNodeDataEnemy[],
        client: Socket,
    ): Promise<void> {
        // Next we check the enemies that we are going to spawn in
        // during combat and get their information from the database
        const enemiesFromDB = await this.enemyService.findEnemiesById(
            enemiesToSpawn,
        );

        // Now if we find enemies, we add them to the combat state and send a new message
        // To the frontend so they can show the proper animations
        if (enemiesFromDB.length > 0) {
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

            client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.SpawnEnemies,
                    data: { enemies: enemiesToAdd },
                }),
            );

            await this.expeditionService.updateByFilter(
                {
                    clientId: client.id,
                    status: ExpeditionStatusEnum.InProgress,
                },
                { $set: { 'currentNode.data.enemies': enemies } },
            );
        }
    }

    private getSporelingsIds = (): number[] => [
        blueSporelingData.enemyId,
        redSporelingData.enemyId,
        yellowSporelingData.enemyId,
    ];
}
