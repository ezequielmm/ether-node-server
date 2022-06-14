import { Module } from '@nestjs/common';
import { StatusPipelineService } from './status-pipeline.service';

@Module({
    providers: [StatusPipelineService],
})
export class StatusPipelineModule { }
