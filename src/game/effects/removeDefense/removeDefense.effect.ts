import { Injectable } from '@nestjs/common';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { Context } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { ExpeditionService } from '../../components/expedition/expedition.service';
import { ClientId } from '../../components/expedition/expedition.type';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { TargetId } from '../effects.types';
import { removeDefenseEffect } from './constants';

@EffectDecorator({
    effect: removeDefenseEffect,
})
@Injectable()
export class RemoveDefenseEffect implements EffectHandler {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly playerService: PlayerService,
    ) {}

    async handle(payload: EffectDTO): Promise<void> {
        const { client, expedition, target } = payload;
        const ctx: Context = {
            client,
            expedition: expedition as ExpeditionDocument,
        };

        if (EffectService.isEnemy(target)) {
            await this.removeDefenseFromEnemy(client.id, target.value.id);
        } else if (EffectService.isPlayer(target)) {
            await this.playerService.setDefense(ctx, 0);
        } else if (EffectService.isAllEnemies(target)) {
            await this.removeDefenseFromAllEnemies(client.id);
        }
    }

    private async removeDefenseFromEnemy(
        clientId: ClientId,
        targetId: TargetId,
    ): Promise<void> {
        // Get enemy based on id
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        enemies.forEach((enemy) => {
            const field = typeof targetId === 'string' ? 'id' : 'enemyId';

            if (enemy[field] === targetId) enemy.defense = 0;
        });

        // update enemies array
        await this.expeditionService.updateEnemiesArray({
            clientId,
            enemies,
        });
    }

    private async removeDefenseFromAllEnemies(
        clientId: ClientId,
    ): Promise<void> {
        // Get enemy based on id
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        enemies.forEach((enemy) => {
            enemy.defense = 0;
        });

        // update enemies array
        await this.expeditionService.updateEnemiesArray({
            clientId,
            enemies,
        });
    }
}
