import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { DiscardAllCardsAction } from './discardAllCards.action';

@Injectable()
export class EndturnAction {
    private readonly logger: Logger = new Logger(EndturnAction.name);

    constructor(
        private readonly discardAllCardsAction: DiscardAllCardsAction,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(client: Socket): Promise<void> {
        await this.discardAllCardsAction.handle({ client });

        const {
            data: {
                player: { energy, energyMax },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.UpdateEnergy}`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EnemyAttacked,
                    action: SWARAction.UpdateEnergy,
                    data: [energy, energyMax],
                }),
            ),
        );
    }
}
