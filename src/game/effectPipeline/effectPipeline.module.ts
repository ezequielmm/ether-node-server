import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EffectPipeline, EffectPipelineSchema } from './effectPipeline.schema';
import { EffectPipelineService } from './effectPipeline.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: EffectPipeline.name,
                schema: EffectPipelineSchema,
            },
        ]),
    ],
    providers: [EffectPipelineService],
    exports: [EffectPipelineService],
})
export class EffectPipelineModule {}
