import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Intention, IntentionType } from '../components/enemy/enemy.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';

@Injectable()
export class SendEnemyIntentProcess {
    private readonly logger: Logger = new Logger(SendEnemyIntentProcess.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async process(client: Socket): Promise<void> {
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });
        const message = [];

        for (const enemy of enemies) {
            message.push({
                id: enemy.id,
                intents: [],
            });

            for (const intention of enemy.currentScript.intentions) {
                message[message.length - 1].intents.push({
                    value: intention.value,
                    description: this.descriptionGenerator(
                        intention.type,
                        intention.value,
                    ),
                });
            }
        }

        this.logger.log(`Sent message EnemiesIntents to client ${client.id}`);

        client.emit(
            'EnemiesIntents',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EnemiesIntents,
                    action: SWARAction.UpdateEnemyIntents,
                    data: message,
                }),
            ),
        );
    }

    private descriptionGenerator(
        intent: IntentionType,
        value?: number,
    ): string {
        switch (intent) {
            case IntentionType.Attack:
                return `This Enemy will attack for ${value} Damage`;
            case IntentionType.Defend:
                return `This Enemy will Defend`;
            case IntentionType.Buff:
                return `This Enemy is plotting to gain a Buff effect`;
            case IntentionType.Debuff:
                return `This Enemy is scheming to apply a Debuff effect`;
            case IntentionType.Stun:
                return `This enemy is doing nothing`;
            default:
                return `Unknown intentions`;
        }
    }
}
