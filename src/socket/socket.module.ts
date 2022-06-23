import { Module } from '@nestjs/common';
import { AuthGatewayModule } from '../authGateway/authGateway.module';
import { ExpeditionModule } from '../game/components/expedition/expedition.module';
import { SocketGateway } from './socket.gateway';
import { CardModule } from '../game/components/card/card.module';
import { ExpeditionActionModule } from '../game/expedition/actions/expedition.action.module';
import { CombatModule } from '../game/node_combat/combat.module';

@Module({
    imports: [
        AuthGatewayModule,
        ExpeditionModule,
        CombatModule,
        CardModule,
        ExpeditionActionModule,
    ],
    providers: [SocketGateway],
})
export class SocketModule {}
