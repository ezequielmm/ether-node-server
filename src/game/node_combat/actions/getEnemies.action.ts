import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { IExpeditionCurrentNodeDataEnemy } from 'src/game/expedition/interfaces';

@Injectable()
export class GetEnemiesAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<IExpeditionCurrentNodeDataEnemy[]> {
        return await this.expeditionService.getCombatEnemies({
            client_id: client.id,
        });
    }
}
