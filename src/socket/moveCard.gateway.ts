import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { corsSocketSettings } from './socket.enum';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EncounterService } from '../game/components/encounter/encounter.service';
import { CombatService } from '../game/combat/combat.service';

export interface IMoveCard {
    cardToTake: string;
}

@WebSocketGateway(corsSocketSettings)
export class MoveCardGateway {
    private readonly logger: Logger = new Logger(MoveCardGateway.name);
    constructor(
        private readonly encounterService: EncounterService,
        private readonly combatService: CombatService,
    ) {}

    @SubscribeMessage('MoveCard')
    async handleMoveCard(client: Socket, payload: string): Promise<void> {
        this.logger.debug(
            `Client ${client.id} trigger message "MoveCard": ${payload}`,
        );

        const encounterData = await this.encounterService.getEncounterData(
            client,
        );
        if (encounterData) {
            await this.encounterService.handleMoveCard(client, payload);
            return;
        }

        await this.combatService.handleMoveCard(client, payload);
    }
}
