import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Effect } from './decorators/effect.decorator';
import { ModifyHPMaxDTO } from './dto';
import { EffectName, IBaseEffect } from './interfaces/baseEffect';

@Effect(EffectName.ModifyHPMax)
@Injectable()
export class ModifyHPMaxEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: ModifyHPMaxDTO): Promise<void> {
        await this.expeditionService.modifyHPMaxValue(payload);
    }
}
