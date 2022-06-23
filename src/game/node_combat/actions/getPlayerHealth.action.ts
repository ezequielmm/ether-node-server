import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

@Injectable()
export class GetPlayerHealthAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<number[]> {
        const { hp_current, hp_max } =
            await this.expeditionService.getPlayerStateByClientId({
                client_id: client.id,
            });

        return [hp_current, hp_max];
    }
}
