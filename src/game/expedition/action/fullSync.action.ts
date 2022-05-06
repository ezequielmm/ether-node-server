import { Socket } from 'socket.io';
import { ExpeditionService } from '../expedition.service';
import { ExpeditionStatusEnum } from '../enums';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FullSyncAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<void> {
        const { map, player_state } = await this.expeditionService.findOne({
            client_id: client.id,
            status: ExpeditionStatusEnum.InProgress,
        });

        client.emit('ExpeditionMap', JSON.stringify({ data: map }));
        client.emit('PlayerState', JSON.stringify({ data: { player_state } }));
    }
}
