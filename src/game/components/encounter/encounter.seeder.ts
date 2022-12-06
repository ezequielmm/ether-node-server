import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Encounter, EncounterDocument } from './encounter.schema';
import { NagpraEncounter } from './data/nagpra.encounter';

@Injectable()
export class EncounterSeeder implements Seeder {
    constructor(
        @InjectModel(Encounter.name)
        private readonly encounter: Model<EncounterDocument>,
    ) {}

    seed(): Promise<any> {
        return this.encounter.insertMany([NagpraEncounter]);
    }
    async drop(): Promise<any> {
        return this.encounter.deleteMany({});
    }
}
