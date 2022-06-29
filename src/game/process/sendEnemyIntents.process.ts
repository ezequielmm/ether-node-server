import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';

enum EnemyIntentName {
    Attacking = 'attacking',
    Defending = 'defending',
    Plotting = 'plotting',
    Scheming = 'scheming',
    Stunned = 'stunned',
    Unknown = 'unknown',
}

interface EnemyIntent {
    id: number;
    type: EnemyIntentName;
    description: string;
    value: number;
}

@Injectable()
export class SendEnemyIntentProcess {
    private readonly logger: Logger = new Logger(SendEnemyIntentProcess.name);

    process(client: Socket): void {
        const data: EnemyIntent[] = [
            {
                type: EnemyIntentName.Attacking,
                description: this.descriptionGenerator(
                    EnemyIntentName.Attacking,
                    5,
                ),
                value: 5,
                id: 9,
            },
        ];

        this.logger.log(`Sent message EnemiesIntents to client ${client.id}`);

        client.emit(
            'EnemiesIntents',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EnemiesIntents,
                    action: SWARAction.UpdateEnemyIntents,
                    data,
                }),
            ),
        );
    }

    private descriptionGenerator(
        intent: EnemyIntentName,
        value?: number,
    ): string {
        switch (intent) {
            case EnemyIntentName.Attacking:
                return `This Enemy will attack for ${value} Damage`;
            case EnemyIntentName.Defending:
                return `This Enemy will Defend`;
            case EnemyIntentName.Plotting:
                return `This Enemy is plotting to gain a Buff effect`;
            case EnemyIntentName.Scheming:
                return `This Enemy is scheming to apply a Debuff effect`;
            case EnemyIntentName.Stunned:
                return `This enemy is doing nothing`;
            default:
                return `Unknown intentions`;
        }
    }
}
