import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { corsSocketSettings } from './socket.enum';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EncounterService } from '../game/components/encounter/encounter.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';

@WebSocketGateway(corsSocketSettings)
export class EncounterGateway {
    private readonly logger: Logger = new Logger(EncounterGateway.name);

    constructor(
        private readonly encounterService: EncounterService,
        private readonly expeditionService: ExpeditionService,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    @SubscribeMessage('EncounterChoice')
    async handleEncounterChoice(
        client: Socket,
        choiceIdx: string,
    ): Promise<string> {

        const waiter = { done: false, data: "" };

        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<ENCOUNTER CHOICE>');
                const ctx = await this.expeditionService.getGameContext(client);

                this.logger.log(
                    ctx.info,
                    `Client ${client.id} trigger message "EncounterChoice" with choiceId: ${choiceIdx}`,
                );

                waiter.data =
                    await this.encounterService.encounterChoice(
                        client,
                        parseInt(choiceIdx),
                    );
                waiter.done = true;

                this.logger.debug('</ENCOUNTER CHOICE>');
            }
        );

        const wait = (ms) => new Promise(res => setTimeout(res, ms));
        let loopBreak = 50;

        while (!waiter.done || loopBreak <= 0) {
            await wait(100);
            loopBreak--;
        }

        return (waiter.done) ? waiter.data : undefined;
    }
}
