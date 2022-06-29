import { Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { ProcessModule } from '../process/process.module';
import { FullSyncAction } from './fullSync.action';

@Module({
    imports: [ExpeditionModule, ProcessModule],
    providers: [FullSyncAction],
    exports: [FullSyncAction],
})
export class ActionModule {}
