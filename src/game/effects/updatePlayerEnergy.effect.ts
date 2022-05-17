import { Injectable } from '@nestjs/common';
import { UpdatePlayerEnergyDTO } from '../expedition/dto';
import { ExpeditionService } from '../expedition/expedition.service';
import { IExpeditionCurrentNode } from '../expedition/interfaces';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class UpdatePlayerEnergyEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(
        payload: UpdatePlayerEnergyDTO,
    ): Promise<IExpeditionCurrentNode> {
        const { current_node } =
            await this.expeditionService.updatePlayerEnergy(payload);
        return current_node;
    }
}
