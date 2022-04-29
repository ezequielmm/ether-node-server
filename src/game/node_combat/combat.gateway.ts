import { WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CombatGateway {
    private readonly logger: Logger = new Logger(CombatGateway.name);
}
