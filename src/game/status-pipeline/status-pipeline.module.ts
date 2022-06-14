import { Module } from '@nestjs/common';
import { StatusPipelineService } from './status-pipeline.service';

@Module({
    providers: [StatusPipelineService],
    exports: [StatusPipelineService],
})
export class StatusPipelineModule {}
