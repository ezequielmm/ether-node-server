import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { corsSocketSettings } from './socket.enum';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EncounterService } from '../game/components/encounter/encounter.service';
import { CombatService } from '../game/combat/combat.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

export interface IMoveCard {
    cardsToTake: string[];
}

@WebSocketGateway(corsSocketSettings)
export class MoveCardGateway {
    private readonly logger: Logger = new Logger(MoveCardGateway.name);
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly encounterService: EncounterService,
        private readonly combatService: CombatService,
    ) {}

    @SubscribeMessage('MoveCard')
    async handleMoveCard(client: Socket, payload: string): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);

        this.logger.log(
            ctx.info,
            `Client ${client.id} trigger message "MoveCard": ${payload}`,
        );

        const encounterData = await this.encounterService.getEncounterData(
            client,
        );
        if (encounterData) {
            await this.encounterService.handleMoveCard(client, payload);
            return;
        }

        await this.combatService.handleMoveCard(ctx, payload);
    }
}
