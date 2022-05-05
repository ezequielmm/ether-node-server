import { Socket } from 'socket.io';
import { ExpeditionService } from '../expedition.service';

export class FullSyncAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<void> {
        client.emit('ExpeditionMap', { test: 'test' });
    }
}
