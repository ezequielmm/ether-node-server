import { Injectable, Logger } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { HistoryService } from 'src/game/history/history.service';
import { EffectRegistry } from 'src/game/history/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { damageEffect } from '../damage/constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { twistTheBlade } from './constants';

@EffectDecorator({
    effect: twistTheBlade,
})
@Injectable()
export class TwistTheBladeEffect implements EffectHandler {
    private readonly logger = new Logger(TwistTheBladeEffect.name);
    constructor(
        private readonly historyService: HistoryService,
        private readonly statusService: StatusService,
        private readonly effectService: EffectService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const lastDamageEffect = this.historyService.findLast(
            dto.ctx.client.id,
            {
                type: 'effect',
                effect: { effect: damageEffect.name },
                source: this.statusService.getReferenceFromEntity(dto.source),
            },
        ) as EffectRegistry;

        if (!lastDamageEffect) {
            this.logger.debug(`No damage effect found, skipping`);
            return;
        }

        let newDamageValue = lastDamageEffect.effect.args.value;
        let targetDefense = 0;

        if (PlayerService.isPlayer(dto.target)) {
            targetDefense = dto.target.value.combatState.defense;
        } else if (EnemyService.isEnemy(dto.target)) {
            targetDefense = dto.target.value.defense;
        }

        if (targetDefense > 0) newDamageValue *= 2;

        await this.effectService.apply({
            ctx: dto.ctx,
            source: dto.source,
            target: dto.target,
            effect: {
                effect: damageEffect.name,
                args: {
                    value: newDamageValue,
                },
            },
        });
    }
}
