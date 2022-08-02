import { Injectable, Logger } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { Context } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { isNotUndefined } from 'src/utils';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../../standardResponse/standardResponse';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { TargetId } from '../effects.types';
import { damageEffect } from './constants';

export interface DamageArgs {
    useDefense?: boolean;
    multiplier?: number;
    useEnergyAsValue?: boolean;
    useEnergyAsMultiplier?: boolean;
}

@EffectDecorator({
    effect: damageEffect,
})
@Injectable()
export class DamageEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(DamageEffect.name);

    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
    ) {}

    async handle(payload: EffectDTO<DamageArgs>): Promise<void> {
        const {
            client,
            target,
            args: {
                currentValue,
                useDefense,
                multiplier,
                useEnergyAsMultiplier,
                useEnergyAsValue,
            },
            expedition: {
                currentNode: {
                    data: {
                        player: { energy: currentEnergy },
                    },
                },
            },
        } = payload;

        const ctx: Context = {
            client,
            expedition: payload.expedition as ExpeditionDocument,
        };

        // Check targeted type
        if (EffectService.isEnemy(target)) {
            // First we check if we have to deal a multiplier
            // using the remaining energy of the player
            const newCurrentValue = isNotUndefined(useEnergyAsMultiplier)
                ? currentValue * currentEnergy
                : currentValue;

            await this.applyDamageToEnemy(
                ctx,
                newCurrentValue,
                target.value.id,
                useDefense,
                multiplier,
            );
        } else if (EffectService.isPlayer(target)) {
            // Here we check if we have to use the enemy available
            // as currentValue, here we just need to add it, the value
            // on the effect is 0
            const newCurrentValue = isNotUndefined(useEnergyAsValue)
                ? currentEnergy
                : currentValue;

            await this.playerService.damage(ctx, newCurrentValue);
        }
    }

    private async applyDamageToEnemy(
        ctx: Context,
        damage: number,
        targetId: TargetId,
        useDefense: boolean,
        multiplier: number,
    ): Promise<void> {
        const player = this.playerService.get(ctx);
        // Get enemy based on id
        const enemy = this.enemyService.get(ctx, targetId);

        if (isNotUndefined(useDefense))
            damage = player.value.combatState.defense * multiplier;

        const dataResponse = [];

        await this.enemyService.damage(ctx, enemy.value.id, damage);

        dataResponse.push({
            id: targetId,
        });

        this.logger.log(
            `Sent message PutData to client ${ctx.client.id}: ${SWARAction.EnemyAffected}`,
        );

        ctx.client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EnemyAffected,
                    action: SWARAction.EnemyAffected,
                    data: dataResponse,
                }),
            ),
        );
    }
}
