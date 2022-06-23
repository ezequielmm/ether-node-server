import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface EnemyIntent {
    type: number;
    description: string;
    value: number;
}

@Injectable()
export class SendEnemyIntentProcess {
    process(client: Socket): void {
        const data: EnemyIntent[] = [
            {
                type: 1,
                description: 'Attack Player',
                value: 5,
            },
        ];

        client.emit('EnemiesIntents', data);
    }
}
