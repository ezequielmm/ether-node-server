import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Effect } from './effects.decorator';
import { EffectName } from './effects.enum';
import { HealCardDTO, IBaseEffect } from './effects.interface';

@Effect(EffectName.Heal)
@Injectable()
export class HealEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: HealCardDTO): Promise<void> {
        const { client, times, calculatedValue } = payload;

        for (let i = 1; i <= times; i++) {
            await this.applyHealToPlayer(client.id, calculatedValue);
        }
    }

    private async applyHealToPlayer(
        clientId: string,
        healToApply: number,
    ): Promise<void> {
        // Get player's current and max health
        const { hpCurrent, hpMax } =
            await this.expeditionService.getPlayerState({ clientId });

        await this.expeditionService.setPlayerHealth({
            clientId,
            hpCurrent: Math.min(hpMax, hpCurrent + healToApply),
        });
    }
}
