import { Module } from '@nestjs/common';
import { AuthGatewayModule } from '../authGateway/authGateway.module';
import { ExpeditionModule } from '../game/expedition/expedition.module';
import { SocketGateway } from './socket.gateway';

@Module({
    imports: [AuthGatewayModule, ExpeditionModule],
    providers: [SocketGateway],
})
export class SocketModule {}
