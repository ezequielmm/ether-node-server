import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { Encounter } from './encounter.schema';
import { NagpraEncounter } from './data/nagpra.encounter';
import { WillowispEncounter } from './data/willowisp.encounter';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { NaiadEncounter } from './data/naiad.encounter';
import { YoungWizardEncounter } from './data/young_wizard.encounter';
import { DancingSatyrEncounter } from './data/dancing_satyr.encounter';
import { MossyTrollEncounter } from './data/mossy_troll.encounter';

@Injectable()
export class EncounterSeeder implements Seeder {
    constructor(
        @InjectModel(Encounter)
        private readonly encounter: ReturnModelType<typeof Encounter>,
    ) {}

    seed(): Promise<any> {
        return this.encounter.insertMany([
            DancingSatyrEncounter,
            MossyTrollEncounter,
            NagpraEncounter,
            NaiadEncounter,
            WillowispEncounter,
            YoungWizardEncounter,
        ]);
    }
    async drop(): Promise<any> {
        return this.encounter.deleteMany({});
    }
}
