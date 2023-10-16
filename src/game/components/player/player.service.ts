import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { find, set } from 'lodash';
import { HistoryService } from 'src/game/history/history.service';
import {
    AttachedStatus,
    Status,
    StatusCounterType,
} from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { CardTargetedEnum } from '../card/card.enum';
import { ExpeditionService } from '../expedition/expedition.service';
import { GameContext, ExpeditionEntity } from '../interfaces';
import {
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
        private readonly historyService: HistoryService,
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
    public isDead(ctx: GameContext): boolean {
        const isCombat = this.expeditionService.isPlayerInCombat(ctx);
        return isCombat
            ? ctx.expedition.currentNode.data.player.hpCurrent <= 0
            : ctx.expedition.playerState.hpCurrent <= 0;
    }

    /**
     * Get the player from the context
     *
     * @param ctx Context
     * @returns The player
     */
    public get(ctx: GameContext): ExpeditionPlayer {
        const { expedition } = ctx;

        const player: ExpeditionPlayer = {
            type: CardTargetedEnum.Player,
            value: {
                id: expedition.userAddress,
                globalState: expedition.playerState,
                combatState: null,
            },
        };

        if (typeof expedition.currentNode.data !== 'undefined') {
            player.value.combatState = expedition.currentNode.data.player;
        }

        return player;
    }

    /**
     * Set the player's defense
     *
     * @param ctx Context
     * @param defense Defense to set
     */
    public async setDefense(
        ctx: GameContext,
        defense: number,
    ): Promise<number> {
        await this.expeditionService.updateById(ctx.expedition._id.toString(), {
            [PLAYER_DEFENSE_PATH]: defense,
        });

        set(ctx.expedition, PLAYER_DEFENSE_PATH, defense);
        this.logger.log(ctx.info, `Player defense set to ${defense}`);

        return defense;
    }

    /**
     * Set the player's energy
     *
     * @param ctx Context
     * @param energy New energy value
     * @returns Return the new energy value
     */
    public async setEnergy(ctx: GameContext, energy: number): Promise<number> {
        await this.expeditionService.updateById(ctx.expedition._id.toString(), {
            [PLAYER_ENERGY_PATH]: energy,
        });

        set(ctx.expedition, PLAYER_ENERGY_PATH, energy);
        this.logger.log(ctx.info, `Player energy set to ${energy}`);

        // console.warn("ESTA ES LA ENERGIA OBTENIDA: " + energy)
        

        return energy;
    }

    /**
     * Set or increases the player's hp
     *
     * @param ctx Context
     * @param hpToCalculate New hp value to set
     * @returns Return the new hp value
     */
    async setHP({
        ctx,
        newHPCurrent,
    }: {
        ctx: GameContext;
        newHPCurrent: number;
    }): Promise<number> {
        const isPlayerInCombat = this.expeditionService.isPlayerInCombat(ctx);

        const {
            expedition: {
                playerState: { hpMax },
            },
        } = ctx;


        const newHp = Math.max(0, Math.min(newHPCurrent, hpMax));

        ctx.expedition.playerState.hpCurrent = newHp;
        ctx.expedition.markModified('playerState.hpCurrent');

        if (isPlayerInCombat) {
            ctx.expedition.currentNode.data.player.hpCurrent = newHp;
            ctx.expedition.markModified('currentNode.data.player.hpCurrent');
        }

        await ctx.expedition.save();

        this.logger.log(ctx.info, `Player hp set to ${newHp} HP`);

        return newHp;
    }

    /**
     *
     * @param ctx the game context
     * @param hpDelta the hp value to increase
     * @returns number
     */
    async setHPDelta({
        ctx,
        hpDelta,
    }: {
        ctx: GameContext;
        hpDelta: number;
    }): Promise<number> {
        const {
            expedition: {
                playerState: { hpCurrent },
            },
        } = ctx;

        const newHPCurrent = hpCurrent + hpDelta;

        return this.setHP({ ctx, newHPCurrent });
    }

    /**
     * Adjust the player's global Max HP by a given amount
     * @returns number
     */
    public async setMaxHPDelta(
        ctx: GameContext,
        adjustment: number,
        shouldHeal = false,
    ): Promise<number> {
        ctx.expedition.playerState.hpMax += adjustment;
        ctx.expedition.playerState.hpCurrent = Math.min(
            ctx.expedition.playerState.hpCurrent,
            ctx.expedition.playerState.hpMax,
        );

        const isPlayerInCombat = this.expeditionService.isPlayerInCombat(ctx);

        if (isPlayerInCombat) {
            ctx.expedition.currentNode.data.player.hpMax += adjustment;
            ctx.expedition.currentNode.data.player.hpCurrent = Math.min(
                ctx.expedition.currentNode.data.player.hpCurrent,
                ctx.expedition.currentNode.data.player.hpMax,
            );
            ctx.expedition.markModified('currentNode.data.player.hpMax');
            ctx.expedition.markModified('currentNode.data.player.hpCurrent');
        }

        if (shouldHeal && adjustment > 0)
            await this.setHPDelta({ ctx, hpDelta: adjustment });

        await ctx.expedition.save();

        this.logger.log(ctx.info, `Player adjust Max HP by ${adjustment}`);

        return ctx.expedition.playerState.hpMax;
    }


    /**
     * Apply damage to the player
     *
     * @param ctx Context
     * @param damage Damage to apply
     * @returns The new hp of the player
     */
    public async damage(ctx: GameContext, damage: number): Promise<number> {
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

        this.logger.log(
            ctx.info,
            `Player received damage for ${damage} points`,
        );

        // Update the player's defense and new health
        await this.setDefense(ctx, newDefense);
        await this.setHP({ ctx, newHPCurrent: newHp });

        // Add damage to history
        this.historyService.register({
            clientId: ctx.client.id,
            registry: {
                type: 'damage',
                damage,
                turn: ctx.expedition.currentNode.data.round,
                target: player,
            },
        });

        return newHp;
    }

    /**
     * Apply damage to the player ignoring defense
     *
     * @param ctx Context
     * @param damage Damage to apply
     * @returns The new hp of the player
     */
    public async breach(ctx: GameContext, damage: number): Promise<number> {
        
        const player = this.get(ctx);
        const currentHp = player.value.combatState.hpCurrent;

        let newHp = Math.max(0, currentHp - damage);
        
        this.logger.log(
            ctx.info,
            `Player received damage for ${damage} points`,
        );

        await this.setHP({ ctx, newHPCurrent: newHp });

        // Add damage to history
        this.historyService.register({
            clientId: ctx.client.id,
            registry: {
                type: 'damage',
                damage,
                turn: ctx.expedition.currentNode.data.round,
                target: player,
            },
        });

        return newHp;
    }

    /**
     * Attach a status to an enemy
     *
     * @param ctx Context
     * @param source Source of the status (Who is attacking)
     * @param name
     * @param [args = { value: 1 }] Arguments to pass to the status
     *
     * @returns Attached status
     * @throws Error if the status is not found
     */
    async attach(
        ctx: GameContext,
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

        if (args.counterDynamic) {
            switch (args.counterDynamic) {
                case 'PlayerEnergy':
                    args.counter =
                        ctx.expedition.currentNode.data.player.energy;
                    break;
            }
        }

        if (oldStatus) {
            this.logger.log(
                ctx.info,
                'Status already attached, incrementing counter',
            );
            // If the status is already attached, we update it
            if (metadata.status.counterType != StatusCounterType.None) {
                // If the status has a counter, we increment it
                oldStatus.args.counter += args.counter;
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

            // Attach the status to the player
            player.value.combatState.statuses[metadata.status.type].push(
                status,
            );

            finalStatusAttached = status;
        }

        // Save the status to the database
        await this.expeditionService.updateByFilter(
            {
                clientId: ctx.client.id,
            },
            {
                [PLAYER_STATUSES_PATH]: player.value.combatState.statuses,
            },
        );

        this.logger.log(ctx.info, `Status ${name} attached to player`);

        return finalStatusAttached;
    }
}
