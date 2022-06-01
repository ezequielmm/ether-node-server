import { Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition/expedition.module';
import { StatusManagerService } from './statusManager.service';

@Module({
    imports: [ExpeditionModule],
    providers: [StatusManagerService],
})
export class StatusManagerModule {}
