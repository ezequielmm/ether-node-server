import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    EffectPipeline,
    EffectPipelineDocument,
} from './effectPipeline.schema';
import { Model } from 'mongoose';
import { CreateEffectPipelineDTO } from './dto';

@Injectable()
export class EffectPipelineService {
    constructor(
        @InjectModel(EffectPipeline.name)
        private readonly effectPipeline: Model<EffectPipelineDocument>,
    ) {}

    async create(
        payload: CreateEffectPipelineDTO,
    ): Promise<EffectPipelineDocument> {
        return await this.effectPipeline.create(payload);
    }
}
