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
        await this.expeditionService.setPlayerDefense({
            clientId: payload.client.id,
            value: payload.calculatedValue,
        });
    }
}
