import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Enemy, EnemyDocument } from './enemy.schema';
import { Model } from 'mongoose';
import { EnemyId, enemyIdField, enemySelector } from './enemy.type';
import { Context, ExpeditionEntity } from '../interfaces';
import { ExpeditionEnemy } from './enemy.interface';
import { CardTargetedEnum } from '../card/card.enum';
import { find, sample } from 'lodash';
import { ExpeditionService } from '../expedition/expedition.service';
import {
    ENEMY_CURRENT_SCRIPT_PATH,
    ENEMY_DEFENSE_PATH,
    ENEMY_HP_CURRENT_PATH,
} from './constants';
import { getRandomItemByWeight } from 'src/utils';
import { AttackQueueService } from '../attackQueue/attackQueue.service';
import { IAttackQueueTarget } from '../attackQueue/attackQueue.interface';

@Injectable()
export class EnemyService {
    private readonly logger: Logger = new Logger(EnemyService.name);

    constructor(
        @InjectModel(Enemy.name) private readonly enemy: Model<EnemyDocument>,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        private readonly attackQueueService: AttackQueueService,
    ) {}

    /**
     * Returns enemy by id or enemyId
     *
     * @param enemyId EnemyId
     * @returns EnemyDocument
     */
    public async findById(enemyId: EnemyId): Promise<EnemyDocument> {
        return typeof enemyId === 'string'
            ? this.enemy.findById(enemyId).lean()
            : this.enemy.findOne({ enemyId }).lean();
    }

    /**
     * Returns all enemies in the expedition
     *
     * @param ctx Context
     * @returns Enemies
     */
    public getAll(ctx: Context): ExpeditionEnemy[] {
        const { expedition } = ctx;

        if (!expedition.currentNode?.data?.enemies)
            throw new Error('Current node has no enemies');

        return expedition.currentNode.data.enemies.map((enemy) => ({
            type: CardTargetedEnum.Enemy,
            value: enemy,
        }));
    }

    /**
     * Returns enemy by id or enemyId from the expedition
     *
     * @param ctx Context
     * @param id Enemy id
     * @returns Enemy
     */
    public get(ctx: Context, id: EnemyId): ExpeditionEnemy {
        const enemies = this.getAll(ctx);

        return find(enemies, {
            value: {
                [enemyIdField(id)]: id,
            },
        });
    }

    /**
     * Returns a random enemy from the expedition
     *
     * @param ctx Context
     * @returns Random enemy
     */
    public getRandom(ctx: Context): ExpeditionEnemy {
        const enemies = this.getAll(ctx);

        return sample(enemies);
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
        ctx: Context,
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

        this.logger.debug(`Set defense of ${id} to ${defense}`);

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
    public async setHp(ctx: Context, id: EnemyId, hp: number): Promise<number> {
        const enemy = this.get(ctx, id);

        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
                ...enemySelector(enemy.value.id),
            },
            {
                [ENEMY_HP_CURRENT_PATH]: hp,
            },
        );

        enemy.value.hpCurrent = hp;

        this.logger.debug(`Set hp of ${id} to ${hp}`);

        return hp;
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
        ctx: Context,
        id: EnemyId,
        damage: number,
    ): Promise<number> {
        const { value: enemy } = this.get(ctx, id);

        const {
            client,
            expedition: { _id },
        } = ctx;

        const attackDetails: IAttackQueueTarget = {
            targetType: CardTargetedEnum.Enemy,
            targetId: enemy.id,
            healthDelta: 0,
            finalHealth: 0,
            defenseDelta: 0,
            finalDefense: 0,
        };

        // First we check if the enemy has defense
        if (enemy.defense > 0) {
            // if is true, then we reduce the damage to the defense
            const newDefense = enemy.defense - damage;

            // Next we check if the new defense is lower than 0
            // and use the remaining value to reduce to the health
            // and the set the defense to 0
            if (newDefense < 0) {
                enemy.hpCurrent = Math.max(
                    0,
                    enemy.hpCurrent - Math.abs(newDefense),
                );
                enemy.defense = 0;

                // Update attackQueue Details
                attackDetails.defenseDelta = -damage;
                attackDetails.finalDefense = enemy.defense;
                attackDetails.healthDelta = newDefense;
                attackDetails.finalHealth = enemy.hpCurrent;
            } else {
                // Otherwise, we update the defense with the new value
                enemy.defense = newDefense;

                // Update attackQueue Details
                attackDetails.defenseDelta = -damage;
                attackDetails.finalDefense = newDefense;
            }
        } else {
            // Otherwise, we apply the damage to the enemy's health
            enemy.hpCurrent = Math.max(0, enemy.hpCurrent - damage);

            // Update attackQueue Details
            attackDetails.healthDelta = -damage;
            attackDetails.finalHealth = enemy.hpCurrent;
        }

        this.logger.debug(
            `Player ${client.id} applied damage of ${damage} to enemy ${id}`,
        );

        await this.setHp(ctx, id, enemy.hpCurrent);
        await this.setDefense(ctx, id, enemy.defense);

        // Save the details to the Attack Queue
        await this.attackQueueService.addTargetToQueue(
            { expeditionId: _id.toString() },
            attackDetails,
        );

        return enemy.hpCurrent;
    }

    /**
     * Calculate new scripts for all enemies
     *
     * @param ctx Context
     */
    async calculateNewIntentions(ctx: Context): Promise<void> {
        const enemies = this.getAll(ctx);

        for (const enemy of enemies) {
            const { scripts } = await this.findById(enemy.value.enemyId);
            const currentScript = enemy.value.currentScript;

            const nextScript = currentScript
                ? scripts[
                      getRandomItemByWeight(
                          currentScript.next,
                          currentScript.next.map((s) => s.probability),
                      ).scriptIndex
                  ]
                : scripts[0];

            await this.expeditionService.updateByFilter(
                {
                    _id: ctx.expedition._id,
                    ...enemySelector(enemy.value.id),
                },
                {
                    [ENEMY_CURRENT_SCRIPT_PATH]: nextScript,
                },
            );

            enemy.value.currentScript = nextScript;

            this.logger.debug(`Calculated new script for ${enemy.value.id}`);
        }
    }

    public static isEnemy(entity: ExpeditionEntity): entity is ExpeditionEnemy {
        return entity.type === CardTargetedEnum.Enemy;
    }
}
