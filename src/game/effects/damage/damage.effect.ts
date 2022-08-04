import { Injectable, Logger } from '@nestjs/common';
import { ExpeditionEnemy } from 'src/game/components/enemy/enemy.interface';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
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
            ctx,
            target,
            args: {
                currentValue,
                useDefense,
                multiplier,
                useEnergyAsMultiplier,
                useEnergyAsValue,
            },
        } = payload;

        const {
            value: {
                combatState: { energy, defense },
            },
        } = this.playerService.get(ctx);

        // Check targeted type
        if (EnemyService.isEnemy(target)) {
            // First we check if we have to deal a multiplier
            // using the remaining energy of the player
            const damage =
                currentValue *
                (useEnergyAsMultiplier ? energy : 1) *
                (useDefense ? multiplier * defense : 1);

            await this.enemyService.damage(ctx, target.value.id, damage);
            this.emitEnemyDamage(ctx, target);
        } else if (PlayerService.isPlayer(target)) {
            // Here we check if we have to use the enemy available
            // as currentValue, here we just need to add it, the value
            // on the effect is 0
            const damage = isNotUndefined(useEnergyAsValue)
                ? energy
                : currentValue;

            await this.playerService.damage(ctx, damage);
        }
    }

    private emitEnemyDamage(ctx: Context, target: ExpeditionEnemy) {
        this.logger.log(
            `Sent message PutData to client ${ctx.client.id}: ${SWARAction.EnemyAffected}`,
        );

        ctx.client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EnemyAffected,
                    action: SWARAction.EnemyAffected,
                    data: [{ id: target.value.id }],
                }),
            ),
        );
    }
}
