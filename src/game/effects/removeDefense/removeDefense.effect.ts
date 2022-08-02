import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { Context } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { removeDefenseEffect } from './constants';

@EffectDecorator({
    effect: removeDefenseEffect,
})
@Injectable()
export class RemoveDefenseEffect implements EffectHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
    ) {}

    async handle(payload: EffectDTO): Promise<void> {
        const { client, expedition, target } = payload;
        const ctx: Context = {
            client,
            expedition: expedition as ExpeditionDocument,
        };

        if (EffectService.isEnemy(target)) {
            await this.enemyService.setDefense(ctx, target.value.id, 0);
        } else if (EffectService.isPlayer(target)) {
            await this.playerService.setDefense(ctx, 0);
        }
    }
}
