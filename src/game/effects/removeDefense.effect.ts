import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { ClientId } from '../components/expedition/expedition.type';
import { EffectDecorator } from './effects.decorator';
import { Effect, EffectDTO, IBaseEffect } from './effects.interface';
import { TargetId } from './effects.types';

export const removeDefenseEffect: Effect = {
    name: 'removeDefense',
};

@EffectDecorator({
    effect: removeDefenseEffect,
})
@Injectable()
export class RemoveDefenseEffect extends IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {
        super();
    }

    async handle(payload: EffectDTO): Promise<void> {
        const { client, target } = payload;

        if (this.isEnemy(target)) {
            await this.removeDefenseFromEnemy(client.id, target.value.id);
        } else if (this.isPlayer(target)) {
            await this.removeDefenseFromPlayer(client.id);
        } else if (this.isAllEnemies(target)) {
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

    private async removeDefenseFromPlayer(clientId: ClientId): Promise<void> {
        // Set player defense
        await this.expeditionService.setPlayerDefense({ clientId, value: 0 });
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
