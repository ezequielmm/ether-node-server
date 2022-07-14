import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { defenseEffect } from './constants';
import { EffectDecorator } from './effects.decorator';
import { EffectDTO, EffectHandler } from './effects.interface';

export interface DefenseArgs {
    useEnemies: boolean;
}

@EffectDecorator({
    effect: defenseEffect,
})
@Injectable()
export class DefenseEffect implements EffectHandler {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: EffectDTO<DefenseArgs>): Promise<void> {
        const {
            client,
            args: { currentValue, useEnemies },
        } = payload;

        let newDefense = currentValue;

        if (useEnemies !== undefined && useEnemies) {
            const {
                data: { enemies },
            } = await this.expeditionService.getCurrentNode({
                clientId: client.id,
            });

            newDefense = currentValue * enemies.length;
        }

        await this.expeditionService.setPlayerDefense({
            clientId: client.id,
            value: newDefense,
        });
    }
}
