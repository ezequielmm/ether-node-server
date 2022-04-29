import { Module } from '@nestjs/common';
import { AuthGatewayModule } from '../authGateway/authGateway.module';
import { ExpeditionModule } from '../game/expedition/expedition.module';
import { SocketGateway } from './socket.gateway';
import { CardModule } from '../game/components/card/card.module';

@Module({
    imports: [AuthGatewayModule, ExpeditionModule, CardModule],
    providers: [SocketGateway],
})
export class SocketModule {}
