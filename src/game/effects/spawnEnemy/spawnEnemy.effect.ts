import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { includes, map, some } from 'lodash';
import { Socket } from 'socket.io';
import { blueSporelingData } from 'src/game/components/enemy/data/blueSporeling.enemy';
import { fungalBruteData } from 'src/game/components/enemy/data/fungalBrute.enemy';
import { redSporelingData } from 'src/game/components/enemy/data/redSporeling.enemy';
import { thornWolfData } from 'src/game/components/enemy/data/thornWolf.enemy';
import { thornWolfPupData } from 'src/game/components/enemy/data/thornWolfPup.enemy';
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
import { Enemy } from 'src/game/components/enemy/enemy.schema';
import { EnemyBuilderService } from 'src/game/components/enemy/enemy-builder.service';
import { CombatService } from 'src/game/combat/combat.service';
import { GameContext } from 'src/game/components/interfaces';

export interface SpawnEnemyArgs {
    enemiesToSpawn: number[];
}

@EffectDecorator({
    effect: spawnEnemyEffect,
})
@Injectable()
export class SpawnEnemyEffect implements EffectHandler {
    
    constructor(private readonly enemyService: EnemyService,
                private readonly expeditionService: ExpeditionService,
                private readonly combatService:CombatService) {}


    async handle(dto: EffectDTO<SpawnEnemyArgs>): Promise<void> {
        
        const ctx            = dto.ctx;
        const enemies        = dto.ctx.expedition.currentNode.data.enemies;
        let enemiesToSpawn = dto.args.enemiesToSpawn;

        // First we check if the current combat has any sporelings alive,
        // only spawn in when there are no sporelings (this is temporary)
        // and the enemy is a fungalbrute
        const combatHasFungalBrute = some(enemies, {
            enemyId: fungalBruteData.enemyId,
        });

        const combatHasThornWolf = some(enemies, {
            enemyId: thornWolfData.enemyId,
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

            if (!combatHasSporelings)
                await this.spawnEnemies(enemiesToSpawn, ctx);
        } else if (combatHasThornWolf) {
            // Now if we have a thornwolf, we check if we have any thornwolf pups alive
            const combatHasThornWolfPups = combatHasThornWolf
                ? some(enemies, (enemy) => {
                    const thornWolfPupsIds = this.getThrornWolfPupsIds();
                    return (
                        enemy.hpCurrent > 0 &&
                        includes(thornWolfPupsIds, enemy.enemyId)
                    );
                })
                : false;

            if (!combatHasThornWolfPups)
                await this.spawnEnemies(enemiesToSpawn, ctx);
        } 
        else {
            await this.spawnEnemies(enemiesToSpawn, ctx);
        }
    }

    private async spawnEnemies(enemiesToSpawn: number[], ctx:GameContext): Promise<void> {
        // Next we check the enemies that we are going to spawn in
        // during combat and get their information from the database
        const enemiesFromDB = await this.enemyService.findEnemiesById(
            enemiesToSpawn,
        );

        if(enemiesFromDB.length <= 0){
            return;
        }

        // Now if we find enemies, we add them to the combat state and send a new message
        // To the frontend so they can show the proper animations
        const enemiesToAdd: IExpeditionCurrentNodeDataEnemy[] = map(
            enemiesFromDB,
            (enemy) => {
                const newHealth = getRandomBetween(
                    enemy.healthRange[0],
                    enemy.healthRange[1],
                );

                return this.buildMinionEnemy(enemy, newHealth);
            },
        );

        const enemiesAlive = this.enemyService.getLiving(ctx);
        const currentNodeEnemies = enemiesAlive.map(enemy => enemy.value)
        const canSpawnEnemy = this.combatService.hasSpaceToSpawnEnemy(currentNodeEnemies, enemiesToAdd);

        if(canSpawnEnemy){
            const newEnemiesList = currentNodeEnemies.concat(enemiesToAdd);
            const sortedEnemiesByLine = this.combatService.sortEnemiesByLine(newEnemiesList);
    
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.SpawnEnemies,
                    data: enemiesToAdd,
                }),
            );
    
            await this.expeditionService.updateByFilter(
                {
                    clientId: ctx.client.id,
                    status: ExpeditionStatusEnum.InProgress,
                },
                { $set: { 'currentNode.data.enemies': sortedEnemiesByLine } },
            );
    
            // Now we generate a new ctx to generate the new enemy intentions
            const newCtx = await this.expeditionService.getGameContext(ctx.client);
    
            // Now we generate the new intentions, always going to the initial 0 state
            enemiesFromDB.forEach(async (enemy) => {
                if(enemy.scripts && enemy.scripts.length > 0){
                    await this.enemyService.setCurrentScript(
                        newCtx,
                        enemy.enemyId,
                        enemy.scripts[0],
                    );
                }else if(enemy.attackLevels){
                    await this.enemyService.setCurrentScript(
                        newCtx,
                        enemy.enemyId,
                        {id: 0, intentions: [EnemyBuilderService.createDoNothingIntent()]},
                    );
                }
            });
        }

    }

    private buildMinionEnemy(enemy:Enemy, newHealth:number):IExpeditionCurrentNodeDataEnemy {
        
        let newMinionEnemy:IExpeditionCurrentNodeDataEnemy;

        //- Old Enemies
        if(enemy.scripts && enemy.scripts.length > 0){
            newMinionEnemy = {
                id: randomUUID(),
                enemyId: enemy.enemyId,
                name: enemy.name,
                category: enemy.category,
                type: enemy.type,
                size: enemy.size,
                defense: 0,
                hpCurrent: newHealth,
                hpMax: newHealth,
                line: 0,
                statuses: {
                    [StatusType.Buff]: [],
                    [StatusType.Debuff]: [],
                },
            }
        }
        //- New Enemies:
        else{
            const formattedCooldowns = this.enemyService.enemyIntentsToExpeditionEnemyCooldowns(enemy);
            newMinionEnemy = {
                id: randomUUID(),
                enemyId: enemy.enemyId,
                name: enemy.name,
                category: enemy.category,
                type: enemy.type,
                size: enemy.size,
                defense: 0,
                hpCurrent: newHealth,
                hpMax: newHealth,
                line: 0,
                statuses: {
                    [StatusType.Buff]: [],
                    [StatusType.Debuff]: [],
                },
                aggressiveness: enemy.aggressiveness,
                intentCooldowns: formattedCooldowns
            }
        }
        return newMinionEnemy;
    }

    private getSporelingsIds = (): number[] => [
        blueSporelingData.enemyId,
        redSporelingData.enemyId,
        yellowSporelingData.enemyId,
    ];

    private getThrornWolfPupsIds = (): number[] => [thornWolfPupData.enemyId];
}
