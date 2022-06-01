import { Injectable } from '@nestjs/common';
import { Activity } from '../elements/prototypes/activity';
import { UpdatePlayerEnergyDTO } from '../expedition/dto';
import { ExpeditionService } from '../expedition/expedition.service';
import { IExpeditionCurrentNode } from '../expedition/interfaces';
import { GameManagerService } from '../gameManager/gameManager.service';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class UpdatePlayerEnergyEffect implements IBaseEffect {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(
        payload: UpdatePlayerEnergyDTO,
    ): Promise<IExpeditionCurrentNode> {
        const { current_node } =
            await this.expeditionService.updatePlayerEnergy(payload);

        await this.gameManagerService.logActivity(
            payload.client_id,
            new Activity(
                'player',
                undefined,
                'update-player-energy',
                undefined,
                [
                    {
                        mod: 'set',
                        key: 'current_node.data.player.energy',
                        val: current_node.data.player.energy,
                    },
                ],
            ),
        );

        return current_node;
    }
}
