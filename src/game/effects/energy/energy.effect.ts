import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../../components/expedition/expedition.service';
import { energyEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';

@EffectDecorator({
    effect: energyEffect,
})
@Injectable()
export class EnergyEffect implements EffectHandler {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: EffectDTO): Promise<void> {
        const {
            client,
            args: { currentValue: amountToAdd },
        } = payload;

        // Get current energy and max energy amount
        const {
            data: {
                player: { energy, energyMax },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        const newEnergy = Math.max(energy + amountToAdd, energyMax);

        // update energy amount
        await this.expeditionService.updatePlayerEnergy({
            clientId: client.id,
            newEnergy,
        });
    }
}
