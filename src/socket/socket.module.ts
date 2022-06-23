import { Module } from '@nestjs/common';
import { AuthGatewayModule } from '../authGateway/authGateway.module';
import { ExpeditionModule } from '../game/components/expedition/expedition.module';
import { SocketGateway } from './socket.gateway';
import { CardModule } from '../game/components/card/card.module';
import { ExpeditionActionModule } from '../game/expedition/actions/expedition.action.module';
import { CombatActionModule } from 'src/game/node_combat/actions/combat.action.module';
import { CombatGateway } from './combat.gateway';
import { ExpeditionGateway } from './expedition.gateway';

@Module({
    imports: [
        AuthGatewayModule,
        ExpeditionModule,
        CardModule,
        ExpeditionActionModule,
        CombatActionModule,
    ],
    providers: [SocketGateway, CombatGateway, ExpeditionGateway],
})
export class SocketModule {}
