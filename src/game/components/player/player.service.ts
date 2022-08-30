import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { set } from 'lodash';
import { AttachedStatus, Status } from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { StatusGenerator } from 'src/game/status/statusGenerator';
import { CardTargetedEnum } from '../card/card.enum';
import {
    CombatQueueTargetEffectTypeEnum,
    CombatQueueTargetTypeEnum,
} from '../combatQueue/combatQueue.enum';
import { ICombatQueueTarget } from '../combatQueue/combatQueue.interface';
import { CombatQueueService } from '../combatQueue/combatQueue.service';
import { ExpeditionService } from '../expedition/expedition.service';
import { Context, ExpeditionEntity } from '../interfaces';
import {
    PLAYER_CURRENT_HP_PATH,
    PLAYER_DEFENSE_PATH,
    PLAYER_ENERGY_PATH,
    PLAYER_STATUSES_PATH,
} from './contants';
import { ExpeditionPlayer } from './interfaces';

@Injectable()
export class PlayerService {
    private readonly logger: Logger = new Logger(PlayerService.name);

    constructor(
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        private readonly combatQueueService: CombatQueueService,
        @Inject(forwardRef(() => StatusService))
        private readonly statusService: StatusService,
    ) {}

    /**
     * Check if the entity is the player
     *
     * @param entity Expedition entity
     * @returns If the entity is the player
     */
    public static isPlayer(
        entity: ExpeditionEntity,
    ): entity is ExpeditionPlayer {
        return entity.type === CardTargetedEnum.Player;
    }

    /**
     * Check if the player is dead
     *
     * @param ctx Context
     * @returns If the player is dead
     */
    public isDead(ctx: Context): boolean {
        return ctx.expedition.playerState.hpCurrent <= 0;
    }

    /**
     * Get the player from the context
     *
     * @param ctx Context
     * @returns The player
     */
    public get(ctx: Context): ExpeditionPlayer {
        const { expedition } = ctx;
        return {
            type: CardTargetedEnum.Player,
            value: {
                globalState: expedition.playerState,
                combatState: expedition.currentNode.data.player,
            },
        };
    }

    /**
     * Set the player's defense
     *
     * @param ctx Context
     * @param defense Defense to set
     */
    public async setDefense(ctx: Context, defense: number): Promise<number> {
        await this.expeditionService.updateById(ctx.expedition._id, {
            [PLAYER_DEFENSE_PATH]: defense,
        });

        set(ctx.expedition, PLAYER_DEFENSE_PATH, defense);
        this.logger.debug(`Player defense set to ${defense}`);

        return defense;
    }

    /**
     * Set the player's energy
     *
     * @param ctx Context
     * @param energy New energy value
     * @returns Return the new energy value
     */
    public async setEnergy(ctx: Context, energy: number): Promise<number> {
        await this.expeditionService.updateById(ctx.expedition._id, {
            [PLAYER_ENERGY_PATH]: energy,
        });

        set(ctx.expedition, PLAYER_ENERGY_PATH, energy);
        this.logger.debug(`Player energy set to ${energy}`);

        return energy;
    }

    /**
     * Set the player's hp
     *
     * @param ctx Context
     * @param hp New hp value
     * @returns Return the new hp value
     */
    public async setHp(ctx: Context, hp: number): Promise<number> {
        const player = this.get(ctx);
        const newHp = Math.min(hp, player.value.globalState.hpMax);

        await this.expeditionService.updateById(ctx.expedition._id, {
            [PLAYER_CURRENT_HP_PATH]: newHp,
        });

        set(ctx.expedition, PLAYER_CURRENT_HP_PATH, newHp);
        this.logger.debug(`Player hp set to ${newHp}`);

        return newHp;
    }

    /**
     * Apply damage to the player
     *
     * @param ctx Context
     * @param damage Damage to apply
     * @returns The new hp of the player
     */
    public async damage(
        ctx: Context,
        damage: number,
        combatQueueId: string,
    ): Promise<number> {
        const player = this.get(ctx);

        const { client } = ctx;

        const currentDefense = player.value.combatState.defense;
        const currentHp = player.value.combatState.hpCurrent;
        const playerUUID = player.value.globalState.playerId;

        // Here we create the target for the combat queue
        const combatQueueTarget: ICombatQueueTarget = {
            effectType: CombatQueueTargetEffectTypeEnum.Damage,
            targetType: CombatQueueTargetTypeEnum.Player,
            targetId: playerUUID,
            defenseDelta: 0,
            finalDefense: 0,
            healthDelta: 0,
            finalHealth: 0,
            statuses: [],
        };

        let newDefense = 0;
        let newHp = currentHp;

        // Now we check if the player has defense to reduce from there
        if (currentDefense > 0) {
            newDefense = currentDefense - damage;

            // If newDefense is negative, it means that the defense is fully
            // depleted and the remaining will be applied to the player's health
            if (newDefense < 0) {
                const newDamage = Math.abs(newDefense);

                newHp = Math.max(0, currentHp - newDamage);

                // Update attackQueue Details
                combatQueueTarget.healthDelta = -newDamage;

                newDefense = 0;

                // Update attackQueue Details
                combatQueueTarget.defenseDelta = -damage;
                combatQueueTarget.finalDefense = newDefense;
                combatQueueTarget.finalHealth = newHp;
            } else {
                // Update attackQueue Details
                combatQueueTarget.defenseDelta = -damage;
                combatQueueTarget.finalDefense = newDefense;
            }
        } else {
            // If the player has no defense, the damage will be applied to the
            // health directly
            newHp = Math.max(0, currentHp - damage);

            // Update attackQueue Details
            combatQueueTarget.healthDelta = -damage;
            combatQueueTarget.finalHealth = newHp;
        }

        this.logger.debug(
            `Player ${client.id} received damage for ${damage} points`,
        );

        // Update the player's defense and new health
        await this.setDefense(ctx, newDefense);
        await this.setHp(ctx, newHp);

        // Net we query the statuses for the player
        const {
            value: {
                combatState: {
                    statuses: { buff, debuff },
                },
            },
        } = player;

        // Now we generate the statuses and add them to the combat queue
        combatQueueTarget.statuses = [
            ...StatusGenerator.formatStatusesToArray(buff),
            ...StatusGenerator.formatStatusesToArray(debuff),
        ];

        // Save the details to the Attack Queue
        await this.combatQueueService.addTargetsToCombatQueue(combatQueueId, [
            combatQueueTarget,
        ]);

        return newHp;
    }

    /**
     * Attach a status to an enemy
     *
     * @param ctx Context
     * @param source Source of the status (Who is attacking)
     * @param [args = { value: 1 }] Arguments to pass to the status
     *
     * @returns Attached status
     * @throws Error if the status is not found
     */
    async attach(
        ctx: Context,
        source: ExpeditionEntity,
        name: Status['name'],
        args: AttachedStatus['args'] = { value: 1 },
    ): Promise<AttachedStatus> {
        const player = this.get(ctx);
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

        // Attach the status to the player
        player.value.combatState.statuses[metadata.status.type].push(status);

        // Save the status to the database
        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
            },
            {
                [PLAYER_STATUSES_PATH]: player.value.combatState.statuses,
            },
        );

        this.logger.debug(`Status ${name} attached to player`);

        return status;
    }
}
