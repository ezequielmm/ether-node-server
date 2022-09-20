import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { find, set } from 'lodash';
import {
    AttachedStatus,
    Status,
    StatusCounterType,
} from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { CardTargetedEnum } from '../card/card.enum';
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
        return ctx.expedition.currentNode.data.player.hpCurrent <= 0;
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
                id: expedition.playerId,
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
    public async damage(ctx: Context, damage: number): Promise<number> {
        // First we get the attackQueue if we have one

        const player = this.get(ctx);

        const currentDefense = player.value.combatState.defense;
        const currentHp = player.value.combatState.hpCurrent;

        let newDefense = 0;
        let newHp = currentHp;

        // Now we check if the player has defense to reduce from there
        if (currentDefense > 0) {
            newDefense = currentDefense - damage;

            // If newDefense is negative, it means that the defense is fully
            // depleted and the remaining will be applied to the player's health
            if (newDefense < 0) {
                newHp = Math.max(0, currentHp + newDefense);
                newDefense = 0;
            }
        } else {
            // If the player has no defense, the damage will be applied to the
            // health directly
            newHp = Math.max(0, currentHp - damage);
        }

        this.logger.debug(`Player received damage for ${damage} points`);

        // Update the player's defense and new health
        await this.setDefense(ctx, newDefense);
        await this.setHp(ctx, newHp);

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
        args: AttachedStatus['args'] = { counter: 1 },
    ): Promise<AttachedStatus> {
        const player = this.get(ctx);
        // Get metadata to determine the type of status to attach
        const metadata = this.statusService.getMetadataByName(name);

        // Check if the status is already attached
        const oldStatus = find(
            player.value.combatState.statuses[metadata.status.type],
            {
                name,
            },
        );

        let finalStatusAttached: AttachedStatus;
        if (oldStatus) {
            this.logger.log('Status already attached, incrementing counter');
            // If the status is already attached, we update it
            if (metadata.status.counterType != StatusCounterType.None) {
                // If the status has a counter, we increment it
                oldStatus.args.counter++;
                this.logger.log(
                    `Status ${name} counter incremented to ${oldStatus.args.counter}`,
                );
            } else {
                this.logger.log(`Status ${name} has no counter`);
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

            // Attach the status to the player
            player.value.combatState.statuses[metadata.status.type].push(
                status,
            );

            finalStatusAttached = status;
        }

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

        return finalStatusAttached;
    }
}
