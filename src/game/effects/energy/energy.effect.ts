import { Injectable } from '@nestjs/common';
import { energyEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';

@EffectDecorator({
    effect: energyEffect,
})
@Injectable()
export class EnergyEffect implements EffectHandler {
    constructor(private readonly playerService: PlayerService) {}

    async handle(payload: EffectDTO): Promise<void> {
        const {
            ctx,
            args: { currentValue: energyToAdd },
        } = payload;

        // Deestructure the expedition to get the current
        // energy available

        const {
            expedition: {
                currentNode: {
                    data: {
                        player: { energy: currentEnergy },
                    },
                },
            },
        } = ctx;

        console.log(energyToAdd, '<-------------------Energia a agregar');
        console.log(payload.args.currentValue, '<-------------------Current value');
        console.log(payload.args.initialValue, '<-------------------Initial value');
        // Sum the values to get the new energy
        const newEnergy = currentEnergy + energyToAdd;

        // Set the new energy value to the expedition
        await this.playerService.setEnergy(ctx, newEnergy);

        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerAffected,
                action: SWARAction.UpdateEnergy,
                data: [
                    newEnergy,
                    ctx.expedition.currentNode.data.player.energyMax,
                ],
            }),
        );
    }
}
