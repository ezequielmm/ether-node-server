import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Encounter } from './encounter.schema';

@Injectable()
export class EncounterService {
    constructor(
        @InjectModel(Encounter.name)
        private readonly encounterModel: Model<Encounter>,
    ) {}

    async getByEncounterId(encounterId: number): Promise<Encounter> {
        const encounter = await this.encounterModel
            .findOne({ encounterId })
            .exec();
        return encounter;
    }
}
