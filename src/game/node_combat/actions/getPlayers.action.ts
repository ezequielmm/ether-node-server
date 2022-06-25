import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

@Injectable()
export class GetPlayersAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<string> {
        const {
            data: { player },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        return JSON.stringify(player);
    }
}
