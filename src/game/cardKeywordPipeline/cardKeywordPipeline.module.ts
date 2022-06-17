import { Module } from '@nestjs/common';
import { CardKeywordPipelineService } from './cardKeywordPipeline.service';

@Module({
    providers: [CardKeywordPipelineService],
    exports: [CardKeywordPipelineService],
})
export class CardKeywordPipelineModule {}
