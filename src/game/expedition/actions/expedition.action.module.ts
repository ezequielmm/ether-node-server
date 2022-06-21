import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition.module';
import { FullSyncAction } from './fullSync.action';
import { NodeSelectedAction } from './nodeSelected.action';
import { CardModule } from '../../components/card/card.module';
import { CurrentNodeGenerator } from './currentNode.generator';
import { StandardResponseModule } from 'src/game/standardResponse/standardResponse.module';
import { SettingsModule } from 'src/game/settings/settings.module';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
        StandardResponseModule,
        SettingsModule,
    ],
    providers: [FullSyncAction, NodeSelectedAction, CurrentNodeGenerator],
    exports: [FullSyncAction, NodeSelectedAction],
})
export class ExpeditionActionModule {}
