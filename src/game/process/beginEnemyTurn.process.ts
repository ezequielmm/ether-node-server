import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';

interface BeginEnemyTurnDTO {
    client: Socket;
}

@Injectable()
export class BeginEnemyTurnProcess {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: BeginEnemyTurnDTO): Promise<void> {
        const { client } = payload;

        await this.expeditionService.setCombatTurn({
            clientId: client.id,
            playing: CombatTurnEnum.Enemy,
        });
    }
}
