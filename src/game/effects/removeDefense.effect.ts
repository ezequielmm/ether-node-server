import { Injectable } from '@nestjs/common';
import { CardTargetedEnum } from '../components/card/card.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { ClientId } from '../components/expedition/expedition.type';
import { Effect } from './effects.decorator';
import { EffectName } from './effects.enum';
import { IBaseEffect, RemoveDefenseDTO } from './effects.interface';
import { TargetId } from './effects.types';

@Effect(EffectName.RemoveDefense)
@Injectable()
export class RemoveDefense implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: RemoveDefenseDTO): Promise<void> {
        const { client, targeted, targetId } = payload;

        switch (targeted) {
            case CardTargetedEnum.Enemy:
                await this.removeDefenseFromEnemy(client.id, targetId);
                break;
            case CardTargetedEnum.Player:
                await this.removeDefenseFromPlayer(client.id);
                break;
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
}
