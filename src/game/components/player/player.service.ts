import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { set } from 'lodash';
import { IAttackQueueTarget } from '../attackQueue/attackQueue.interface';
import { AttackQueueService } from '../attackQueue/attackQueue.service';
import { CardTargetedEnum } from '../card/card.enum';
import { ExpeditionService } from '../expedition/expedition.service';
import { Context, ExpeditionEntity } from '../interfaces';
import {
    PLAYER_CURRENT_HP_PATH,
    PLAYER_DEFENSE_PATH,
    PLAYER_ENERGY_PATH,
} from './contants';
import { ExpeditionPlayer } from './interfaces';

@Injectable()
export class PlayerService {
    private readonly logger: Logger = new Logger(PlayerService.name);

    constructor(
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        private readonly attackQueueService: AttackQueueService,
    ) {}

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

        return hp;
    }

    /**
     * Apply damage to the player
     *
     * @param ctx Context
     * @param damage Damage to apply
     * @returns The new hp of the player
     */
    public async damage(ctx: Context, damage: number): Promise<number> {
        const player = this.get(ctx);

        const {
            client,
            expedition: { _id },
        } = ctx;

        const currentDefense = player.value.combatState.defense;
        const currentHp = player.value.globalState.hpCurrent;
        const playerUUID = player.value.globalState.playerId;

        const attackDetails: IAttackQueueTarget = {
            targetType: CardTargetedEnum.Player,
            targetId: playerUUID,
            defenseDelta: 0,
            finalDefense: 0,
            healthDelta: 0,
            finalHealth: 0,
        };

        let newDefense = 0;
        let newHp = currentHp;

        // Now we check if the player has defense to reduce from there
        if (currentDefense > 0) {
            newDefense = currentDefense - damage;

            // If newDefense is negative, it means that the defense is fully
            // depleted and the remaining will be applied to the player's health
            if (newDefense < 0) {
                newHp = Math.max(0, currentHp - Math.abs(newDefense));
                newDefense = 0;

                // Update attackQueue Details
                attackDetails.defenseDelta = -damage;
                attackDetails.finalDefense = newDefense;
                attackDetails.healthDelta = newDefense;
                attackDetails.finalHealth = newHp;
            } else {
                // Update attackQueue Details
                attackDetails.defenseDelta = -damage;
                attackDetails.finalDefense = newDefense;
            }
        } else {
            // If the player has no defense, the damage will be applied to the
            // health directly
            newHp = Math.max(0, currentHp - damage);

            // Update attackQueue Details
            attackDetails.healthDelta = -damage;
            attackDetails.finalHealth = newHp;
        }

        this.logger.debug(
            `Player ${client.id} received damage for ${damage} points`,
        );

        // Update the player's defense and new health
        await this.setDefense(ctx, newDefense);
        await this.setHp(ctx, newHp);

        // Save the details to the Attack Queue
        await this.attackQueueService.addTargetToQueue(
            { expeditionId: _id.toString() },
            attackDetails,
        );

        return newHp;
    }

    public static isPlayer(
        entity: ExpeditionEntity,
    ): entity is ExpeditionPlayer {
        return entity.type === CardTargetedEnum.Player;
    }
}
