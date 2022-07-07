import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Effect } from './effects.decorator';
import { EffectName } from './effects.enum';
import { DefenseDTO, IBaseEffect } from './effects.interface';

@Effect(EffectName.Defense)
@Injectable()
export class DefenseEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DefenseDTO): Promise<void> {
        const { client, calculatedValue, useEnemies } = payload;

        let newDefense = calculatedValue;

        if (useEnemies !== undefined && useEnemies) {
            const {
                data: { enemies },
            } = await this.expeditionService.getCurrentNode({
                clientId: client.id,
            });

            newDefense = calculatedValue * enemies.length;
        }

        await this.expeditionService.setPlayerDefense({
            clientId: client.id,
            value: newDefense,
        });
    }
}
