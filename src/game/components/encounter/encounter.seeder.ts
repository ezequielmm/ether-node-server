import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { Encounter } from './encounter.schema';
import { NagpraEncounter } from './data/nagpra.encounter';
import { WillowispEncounter } from './data/willowisp.encounter';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class EncounterSeeder implements Seeder {
    constructor(
        @InjectModel(Encounter)
        private readonly encounter: ReturnModelType<typeof Encounter>,
    ) {}

    seed(): Promise<any> {
        return this.encounter.insertMany([NagpraEncounter, WillowispEncounter]);
    }
    async drop(): Promise<any> {
        return this.encounter.deleteMany({});
    }
}
