import { Module } from '@nestjs/common';
import { AuthGatewayModule } from '../authGateway/authGateway.module';
import { ExpeditionModule } from '../game/components/expedition/expedition.module';
import { SocketGateway } from './socket.gateway';
import { CardModule } from '../game/components/card/card.module';
import { CombatGateway } from './combat.gateway';
import { ExpeditionGateway } from './expedition.gateway';
import { ActionModule } from 'src/game/action/action.module';
import { ProcessModule } from 'src/game/process/process.module';
import { CharacterModule } from 'src/game/components/character/character.module';
import { PlayerModule } from 'src/game/components/player/player.module';
import { CombatQueueModule } from 'src/game/components/combatQueue/combatQueue.module';

@Module({
    imports: [
        AuthGatewayModule,
        ExpeditionModule,
        CardModule,
        ActionModule,
        ProcessModule,
        CharacterModule,
        PlayerModule,
        CombatQueueModule,
    ],
    providers: [SocketGateway, CombatGateway, ExpeditionGateway],
})
export class SocketModule {}
