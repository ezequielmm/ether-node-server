import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Enemy } from './enemy.schema';
import { EnemyId, enemyIdField, enemySelector } from './enemy.type';
import { GameContext, ExpeditionEntity } from '../interfaces';
import { EnemyScript, ExpeditionEnemy } from './enemy.interface';
import { CardTargetedEnum } from '../card/card.enum';
import { find, reject, sample, isEmpty, each, isEqual } from 'lodash';
import { ExpeditionService } from '../expedition/expedition.service';
import {
    ENEMY_CURRENT_SCRIPT_PATH,
    ENEMY_DEFENSE_PATH,
    ENEMY_HP_CURRENT_PATH,
    ENEMY_STATUSES_PATH,
} from './constants';
import { getRandomItemByWeight } from 'src/utils';
import {
    AttachedStatus,
    Status,
    StatusCounterType,
    StatusesGlobalCollection,
} from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { EnemyCategoryEnum, EnemyIntentionType } from './enemy.enum';
import { damageEffect } from 'src/game/effects/damage/constants';
import {
    EVENT_ENEMY_DEAD,
    HARD_MODE_NODE_END,
    HARD_MODE_NODE_START,
} from 'src/game/constants';
import { ReturnModelType } from '@typegoose/typegoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectionFields } from 'mongoose';

@Injectable()
export class EnemyService {

    private readonly logger: Logger = new Logger(EnemyService.name);

    constructor(
        @InjectModel(Enemy)
        private readonly enemy: ReturnModelType<typeof Enemy>,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => StatusService))
        private readonly statusService: StatusService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    /**
     * Check if the entity is an enemy
     *
     * @param entity ExpeditionEntity
     * @returns If the entity is an enemy
     */
    public static isEnemy(entity: ExpeditionEntity): entity is ExpeditionEnemy {
        return entity.type === CardTargetedEnum.Enemy;
    }

    /**
     * Check if the enemy is dead
     *
     * @param enemy Enemy
     * @returns If the enemy is dead
     */
    public isDead(enemy: ExpeditionEnemy): boolean {
        return enemy.value.hpCurrent <= 0;
    }

    /**
     * Check if all enemies are dead
     *
     * @param ctx Context
     * @returns If all enemies are dead
     */
    public isAllDead(ctx: GameContext): boolean {
        return this.getAll(ctx).every((enemy) => this.isDead(enemy));
    }
    public isBossDead(ctx: GameContext): boolean {
        return this.getAll(ctx).some(enemy => 
            enemy.value.category === EnemyCategoryEnum.Boss && this.isDead(enemy)
        );
    }
    
    /**
     * Returns enemy by id or enemyId
     *
     * @param enemyId EnemyId
     * @returns Enemy
     */
    public async findById(
        enemyId: EnemyId,
        projection?: ProjectionFields<Enemy>,
    ): Promise<Enemy> {
        return typeof enemyId === 'string'
            ? this.enemy.findById(enemyId, projection).lean()
            : this.enemy.findOne({ enemyId }, projection).lean();
    }

    /**
     * Returns all enemies in the expedition
     *
     * @param ctx Context
     * @returns Enemies
     */
    public getAll(ctx: GameContext): ExpeditionEnemy[] {
        const { expedition } = ctx;

        if (!expedition.currentNode?.data?.enemies)
            throw new Error('Current node has no enemies');

        const enemiesToReturn: ExpeditionEnemy[] = [];

        for (const enemy of expedition.currentNode.data.enemies) {
            enemiesToReturn.push({
                type: CardTargetedEnum.Enemy,
                value: enemy,
            });
        }

        return enemiesToReturn;
    }

    public getLiving(ctx: GameContext): ExpeditionEnemy[] {
        return this.getAll(ctx).filter((enemy) => !this.isDead(enemy));
    }

    public getEnemyStatuses(ctx: GameContext): StatusesGlobalCollection {
        return this.statusService
            .getAllFromEnemies(ctx)
            .filter(
                (entity) =>
                    entity.target.type == CardTargetedEnum.Enemy &&
                    entity.target.value.hpCurrent > 0,
            );
    }

    public haveChangedStatuses(
        ctx: GameContext,
        priorStatuses: StatusesGlobalCollection,
    ): boolean {
        let changesFound = false;
        const currentStatuses = this.getEnemyStatuses(ctx);

        each(currentStatuses, (enemy) => {
            if (
                !isEqual(
                    enemy.statuses,
                    find(
                        priorStatuses,
                        (e) =>
                            e.target.type == CardTargetedEnum.Enemy &&
                            enemy.target.type == CardTargetedEnum.Enemy &&
                            e.target.value.enemyId ==
                                enemy.target.value.enemyId,
                    ).statuses,
                )
            ) {
                changesFound = true;
                return false; // end 'each'
            }
        });

        return changesFound;
    }

    /**
     * Returns enemy by id or enemyId from the expedition
     *
     * @param ctx Context
     * @param id Enemy id
     * @returns Enemy
     */
    public get(ctx: GameContext, id: EnemyId): ExpeditionEnemy {
        const enemies = this.getAll(ctx);

        for (const enemy of enemies) {
            if (enemy.value[enemyIdField(id)] === id) return enemy;
        }

        return null;
    }

    /**
     * Returns a random enemy from the expedition
     *
     * @param ctx Context
     * @returns Random enemy
     */
    public getRandom(ctx: GameContext): ExpeditionEnemy {
        const enemies = this.getAll(ctx);

        return sample(
            // Reject enemies that are dead
            reject(enemies, {
                value: {
                    hpCurrent: 0,
                },
            }),
        );
    }

    /**
     * Sets the current script of an enemy
     *
     * @param ctx Context
     * @param id Enemy id
     * @param script Enemy script value
     * @returns Enemy script value
     */
    public async setCurrentScript(
        ctx: GameContext,
        id: EnemyId,
        script: EnemyScript,
    ): Promise<EnemyScript> {
        const enemy = this.get(ctx, id);

        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
                ...enemySelector(enemy.value.id),
            },
            {
                [ENEMY_CURRENT_SCRIPT_PATH]: script,
            },
        );

        enemy.value.currentScript = script;

        this.logger.log(ctx.info, `Set script of enemy ${id} to ${script}`);

        return script;
    }

    /**
     * Sets the defense of an enemy
     *
     * @param ctx Context
     * @param id Enemy id
     * @param defense Defense value
     * @returns Defense value
     */
    public async setDefense(
        ctx: GameContext,
        id: EnemyId,
        defense: number,
    ): Promise<number> {
        const enemy = this.get(ctx, id);

        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
                ...enemySelector(enemy.value.id),
            },
            {
                [ENEMY_DEFENSE_PATH]: defense,
            },
        );

        enemy.value.defense = defense;

        this.logger.log(ctx.info, `Set defense of enemy ${id} to ${defense}`);

        return defense;
    }

    /**
     * Sets the health of an enemy
     *
     * @param ctx Context
     * @param id Enemy id
     * @param hp Health value
     * @returns Health value
     */
    public async setHp(
        ctx: GameContext,
        id: EnemyId,
        hp: number,
    ): Promise<number> {
        const enemy = this.get(ctx, id);

        const newHp = Math.min(hp, enemy.value.hpMax);

        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
                ...enemySelector(enemy.value.id),
            },
            {
                [ENEMY_HP_CURRENT_PATH]: newHp,
            },
        );

        enemy.value.hpCurrent = newHp;

        this.logger.log(ctx.info, `Set hpCurrent of enemy ${id} to ${hp}`);

        return newHp;
    }

    /**
     * Applies damage to an enemy
     *
     * @param ctx Context
     * @param id Enemy id
     * @param damage Damage value
     * @returns New health value
     */
    public async damage(
        ctx: GameContext,
        id: EnemyId,
        damage: number,
    ): Promise<number> {
        const { value: enemy } = this.get(ctx, id);

        const { client } = ctx;

        // First we check if the enemy has defense
        if (enemy.defense > 0) {
            // if is true, then we reduce the damage to the defense
            const newDefense = enemy.defense - damage;

            // Next we check if the new defense is lower than 0
            // and use the remaining value to reduce to the health
            // and the set the defense to 0
            if (newDefense < 0) {
                enemy.hpCurrent = Math.max(0, enemy.hpCurrent + newDefense);
                enemy.defense = 0;
            } else {
                // Otherwise, we update the defense with the new value
                enemy.defense = newDefense;
            }
        } else {
            // Otherwise, we apply the damage to the enemy's health
            enemy.hpCurrent = Math.max(0, enemy.hpCurrent - damage);
        }

        this.logger.log(
            ctx.info,
            `Player ${client.id} applied damage of ${damage} to enemy ${id}`,
        );

        await this.setHp(ctx, id, enemy.hpCurrent);
        await this.setDefense(ctx, id, enemy.defense);

        if (enemy.hpCurrent === 0) {
            let pathToUpdate = undefined;
            switch (enemy.category) {
                case EnemyCategoryEnum.Basic:
                    pathToUpdate = 'basicEnemiesDefeated';
                    break;
                case EnemyCategoryEnum.Minion:
                    pathToUpdate = 'minionEnemiesDefeated';
                    break;
                case EnemyCategoryEnum.Elite:
                    pathToUpdate = 'eliteEnemiesDefeated';
                    break;
                case EnemyCategoryEnum.Boss:
                    pathToUpdate = 'bossEnemiesDefeated';
                    break;
            }

            if (pathToUpdate) {
                ctx.expedition.scores[pathToUpdate]++;
            }

            //TODO: Refactor the below to just use pathToUpdate, when there's time to test it.
            await this.expeditionService.updateByFilter(
                {
                    clientId: client.id,
                },
                {
                    $inc: {
                        ...(enemy.category === EnemyCategoryEnum.Basic && {
                            'scores.basicEnemiesDefeated': 1,
                        }),
                        ...(enemy.category === EnemyCategoryEnum.Minion && {
                            'scores.minionEnemiesDefeated': 1,
                        }),
                        ...(enemy.category === EnemyCategoryEnum.Elite && {
                            'scores.eliteEnemiesDefeated': 1,
                        }),
                        ...(enemy.category === EnemyCategoryEnum.Boss && {
                            'scores.bossEnemiesDefeated': 1,
                        }),
                    },
                },
            );

            await this.eventEmitter.emitAsync(EVENT_ENEMY_DEAD, { ctx, enemy });
        }

        return enemy.hpCurrent;
    }

    /**
     * Calculate new scripts for all enemies
     *
     * @param ctx Context
     */
    async calculateNewIntentions(ctx: GameContext): Promise<void> {
        const enemies = this.getAll(ctx);

        const enemiesAlive = enemies.filter(
            (enemy) => enemy.value.hpCurrent > 0,
        );

        for (const enemy of enemiesAlive) {
            const { scripts } = await this.findById(enemy.value.enemyId);
            const currentScript = enemy.value.currentScript;
            let nextScript: EnemyScript;

            if (currentScript) {
                nextScript = this.getNextScript(scripts, currentScript);
            } else {
                nextScript = scripts[0];

                // If the first script does not have intentions,
                // then it is used only to calculate the next possible script
                if (isEmpty(nextScript.intentions)) {
                    nextScript = this.getNextScript(scripts, nextScript);
                }
            }

            // Increase damage for node from 14 to 20
            const node = ctx.expedition.map.find(
                (node) => node.id == ctx.expedition.currentNode.nodeId,
            );

            if (
                HARD_MODE_NODE_START <= node.step &&
                node.step <= HARD_MODE_NODE_END
            ) {
                this.increaseScriptDamage(nextScript);
            }

            await this.expeditionService.updateByFilter(
                {
                    clientId: ctx.client.id,
                    ...enemySelector(enemy.value.id),
                },
                {
                    [ENEMY_CURRENT_SCRIPT_PATH]: nextScript,
                },
            );

            enemy.value.currentScript = nextScript;

            this.logger.log(
                ctx.info,
                `Calculated new script for enemy ${enemy.value.id}`,
            );
            this.logger.log(
                ctx.info,
                `New script: ${JSON.stringify(nextScript)}`,
            );
        }
    }

    private getNextScript(
        scripts: EnemyScript[],
        currentScript: EnemyScript,
    ): EnemyScript {
        return find(scripts, {
            id: getRandomItemByWeight(
                currentScript.next,
                currentScript.next.map((s) => s.probability),
            ).scriptId,
        });
    }

    /**
     * Increase damage for script
     *
     * @param script Script
     * @param scale Scale to increase
     */
    private increaseScriptDamage(script: EnemyScript, scale = 1.5) {
        script.intentions.forEach((intention) => {
            if (intention.type == EnemyIntentionType.Attack) {
                intention.value = Math.floor(intention.value * scale);
                intention.effects.forEach((effect) => {
                    if (effect.effect == damageEffect.name) {
                        effect.args.value = Math.floor(
                            effect.args.value * scale,
                        );
                    }
                });
            }
        });
    }

    /**
     * Get multiple enemies by their id
     *
     * @param enemies number[]
     */
    async findEnemiesById(enemies: number[]): Promise<Enemy[]> {
        return await this.enemy.find({ enemyId: { $in: enemies } }).lean();
    }

    /**
     * Attach a status to an enemy
     *
     * @param ctx Context
     * @param id Enemy id
     * @param source Source of the status (Who is attacking)
     * @param status Status to attach
     * @param [args = { value: 1 }] Arguments to pass to the status
     *
     * @returns Attached status
     * @throws Error if the status is not found
     */
    async attach(
        ctx: GameContext,
        id: EnemyId,
        source: ExpeditionEntity,
        name: Status['name'],
        args: AttachedStatus['args'] = { counter: 1 },
    ): Promise<AttachedStatus> {
        const enemy = this.get(ctx, id);
        // Get metadata to determine the type of status to attach
        const metadata = this.statusService.getMetadataByName(name);

        // Check if the status is already attached
        const oldStatus = find(enemy.value.statuses[metadata.status.type], {
            name,
        });

        let finalStatusAttached: AttachedStatus;
        if (oldStatus) {
            // If the status is already attached, we update it
            if (metadata.status.counterType != StatusCounterType.None) {
                // If the status has a counter, we increment it
                oldStatus.args.counter++;
                this.logger.log(
                    ctx.info,
                    `Status ${name} counter incremented to ${oldStatus.args.counter}`,
                );
            } else {
                this.logger.log(ctx.info, `Status ${name} has no counter`);
            }

            finalStatusAttached = oldStatus;
        } else {
            // Create the status to attach
            const status: AttachedStatus = {
                name,
                args,
                sourceReference: {
                    type: source.type,
                    id: source.value['id'],
                },
                addedInRound: ctx.expedition.currentNode.data.round,
            };

            // Attach the status to the enemy
            enemy.value.statuses[metadata.status.type].push(status);

            finalStatusAttached = status;
        }

        // Save the status to the database
        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
                ...enemySelector(enemy.value.id),
            },
            {
                [ENEMY_STATUSES_PATH]: enemy.value.statuses,
            },
        );

        this.logger.log(ctx.info, `Status ${name} attached to enemy ${id}`);

        return finalStatusAttached;
    }
}
