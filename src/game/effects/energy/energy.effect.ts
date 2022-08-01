import { Injectable } from '@nestjs/common';
import { energyEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { PlayerService } from 'src/game/components/player/player.service';
import { Context } from 'src/game/components/interfaces';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';

@EffectDecorator({
    effect: energyEffect,
})
@Injectable()
export class EnergyEffect implements EffectHandler {
    constructor(private readonly playerService: PlayerService) {}

    async handle(payload: EffectDTO): Promise<void> {
        const {
            client,
            args: { currentValue: energyToAdd },
            expedition,
        } = payload;

        // Deestructure the expedition to get the current
        // energy available
        const {
            currentNode: {
                data: {
                    player: { energy: currentEnergy },
                },
            },
        } = expedition;

        // Sum the values to get the new energy
        const newEnergy = currentEnergy + energyToAdd;

        const ctx: Context = {
            client,
            expedition: expedition as ExpeditionDocument,
        };

        // Set the new energy value to the expedition
        await this.playerService.setEnergy(ctx, newEnergy);
    }
}
