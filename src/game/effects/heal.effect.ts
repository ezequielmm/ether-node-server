import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { healEffect } from './constants';
import { EffectDecorator } from './effects.decorator';
import { EffectDTO, IBaseEffect } from './effects.interface';
import { EffectService } from './effects.service';

export interface HealArgs {
    value: number;
}

@EffectDecorator({
    effect: healEffect,
})
@Injectable()
export class HealEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: EffectDTO<HealArgs>): Promise<void> {
        const {
            client,
            target,
            args: { currentValue },
        } = payload;

        if (EffectService.isPlayer(target)) {
            await this.applyHealToPlayer(client.id, currentValue);
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
