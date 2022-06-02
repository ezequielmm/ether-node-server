import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EffectPipelineDocument = EffectPipeline & Document;

export class EffectPipeline {
    @Prop()
    client_id: string;

    @Prop({ type: Object })
    statuses: {
        resolve?: {
            value: number;
            turns: number;
        };
    };
}

export const EffectPipelineSchema =
    SchemaFactory.createForClass(EffectPipeline);
