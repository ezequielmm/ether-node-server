import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Effect } from './effects.decorator';
import { EffectName } from './effects.enum';
import { EnergyDTO, IBaseEffect } from './effects.interface';

@Effect(EffectName.Energy)
@Injectable()
export class EnergyEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: EnergyDTO): Promise<void> {
        const { client, times, calculatedValue } = payload;

        for (let i = 1; i <= times; i++) {
            this.applyEnergyToPlayer(client.id, calculatedValue);
        }
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
