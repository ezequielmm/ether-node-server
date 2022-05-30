import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition.module';
import { FullSyncAction } from './fullSync.action';
import { NodeSelectedAction } from './nodeSelected.action';
import { CardModule } from '../../components/card/card.module';

@Module({
    imports: [forwardRef(() => ExpeditionModule), forwardRef(() => CardModule)],
    providers: [FullSyncAction, NodeSelectedAction],
    exports: [FullSyncAction, NodeSelectedAction],
})
export class ExpeditionActionModule {}
