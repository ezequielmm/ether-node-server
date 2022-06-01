import { Injectable } from '@nestjs/common';
import { Activity } from '../elements/prototypes/activity';
import { ExpeditionService } from '../expedition/expedition.service';
import { GameManagerService } from '../gameManager/gameManager.service';
import { TurnChangeDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class TurnChangeEffect implements IBaseEffect {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(payload: TurnChangeDTO): Promise<void> {
        const expedition = await this.expeditionService.turnChange(payload);

        await this.gameManagerService.logActivity(
            payload.client_id,
            new Activity('current_node', undefined, 'turn-change', undefined, [
                {
                    mod: 'set',
                    key: 'current_node.data.round',
                    val: expedition.current_node.data.round,
                },
            ]),
        );
    }
}
