import { Module } from '@nestjs/common';
import { StatusManagerService } from './statusManager.service';

@Module({
    imports: [StatusManagerService],
})
export class StatusManagerModule {}
