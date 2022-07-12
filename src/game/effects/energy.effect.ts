import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { EffectDecorator } from './effects.decorator';
import { Effect, EffectDTO, IBaseEffect } from './effects.interface';

export const energyEffect: Effect = {
    name: 'energy',
};

@EffectDecorator({
    effect: energyEffect,
})
@Injectable()
export class EnergyEffect extends IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {
        super();
    }

    async handle(payload: EffectDTO): Promise<void> {
        const {
            client,
            args: { currentValue },
        } = payload;

        this.applyEnergyToPlayer(client.id, currentValue);
    }

    private async applyEnergyToPlayer(
        clientId: string,
        amountToAdd: number,
    ): Promise<void> {
        // Get current energy and max energy amount
        const {
            data: {
                player: { energy },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: clientId,
        });

        const newEnergy = energy + amountToAdd;

        // update energy amount
        await this.expeditionService.updatePlayerEnergy({
            clientId,
            newEnergy,
        });
    }
}
