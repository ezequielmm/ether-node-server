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
    ENEMY_STATUSES_PATH,
} from './constants';
import { getRandomItemByWeight } from 'src/utils';
import { AttachedStatus, Status } from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';

@Injectable()
export class EnemyService {
    private readonly logger: Logger = new Logger(EnemyService.name);

    constructor(
        @InjectModel(Enemy.name) private readonly enemy: Model<EnemyDocument>,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => StatusService))
        private readonly statusService: StatusService,
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
    public isAllDead(ctx: Context): boolean {
        return this.getAll(ctx).every((enemy) => this.isDead(enemy));
    }

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

        this.logger.debug(`Set defense of enemy ${id} to ${defense}`);

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

        this.logger.debug(`Set hpCurrent of enemy ${id} to ${hp}`);

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
        ctx: Context,
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

        this.logger.debug(
            `Player ${client.id} applied damage of ${damage} to enemy ${id}`,
        );

        await this.setHp(ctx, id, enemy.hpCurrent);
        await this.setDefense(ctx, id, enemy.defense);

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

            this.logger.debug(
                `Calculated new script for enemy ${enemy.value.id}`,
            );
        }
    }

    /**
     * Get multiple enemies by their id
     *
     * @param enemies number[]
     */
    async findEnemiesById(enemies: number[]): Promise<EnemyDocument[]> {
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
        ctx: Context,
        id: EnemyId,
        source: ExpeditionEntity,
        name: Status['name'],
        args: AttachedStatus['args'] = { value: 1 },
    ): Promise<AttachedStatus> {
        const enemy = this.get(ctx, id);
        // Get metadata to determine the type of status to attach
        const metadata = this.statusService.getMetadataByName(name);

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

        this.logger.debug(`Status ${name} attached to enemy ${id}`);

        return status;
    }
}
