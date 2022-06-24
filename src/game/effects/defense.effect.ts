import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Effect } from './decorators/effect.decorator';
import { DefenseDTO } from './dto';
import { EffectName, IBaseEffect } from './interfaces/baseEffect';

@Effect(EffectName.Defense)
@Injectable()
export class DefenseEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DefenseDTO): Promise<void> {
        await this.expeditionService.setPlayerDefense(payload);
    }
}
