import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { EffectDecorator } from './effects.decorator';
import { Effect, EffectDTO, IBaseEffect } from './effects.interface';

export const healEffect: Effect = {
    name: 'heal',
};

export interface HealArgs {
    value: number;
}

@EffectDecorator({
    effect: healEffect,
})
@Injectable()
export class HealEffect extends IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {
        super();
    }

    async handle(payload: EffectDTO<HealArgs>): Promise<void> {
        const {
            client,
            target,
            args: { currentValue },
        } = payload;

        if (this.isPlayer(target)) {
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
