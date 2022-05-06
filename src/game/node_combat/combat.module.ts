import { Module } from '@nestjs/common';
import { CombatActionModule } from './actions/combat.action.module';
import { CombatGateway } from './combat.gateway';

@Module({
    imports: [CombatActionModule],
    providers: [CombatGateway],
})
export class CombatModule {}
