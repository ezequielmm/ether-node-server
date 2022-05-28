import { Injectable } from '@nestjs/common';
import { ExpeditionStatusEnum } from '../expedition/enums';
import { ExpeditionService } from '../expedition/expedition.service';
import { ModifyHPMaxDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class ModifyHPMaxEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: ModifyHPMaxDTO): Promise<void> {
        const { client_id, hp_value } = payload;
        const expedition = await this.expeditionService.findOne({
            client_id,
            status: ExpeditionStatusEnum.InProgress,
        });

        const { hp_current } = expedition.player_state;

        const newHpValue = Math.min(hp_current, hp_value);

        expedition.player_state.hp_current = newHpValue;
        expedition.player_state.hp_max = hp_value;

        await expedition.save();
    }
}
