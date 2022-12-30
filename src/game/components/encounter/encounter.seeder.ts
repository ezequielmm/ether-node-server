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
import { EnchantedForest } from './data/enchanted_forest.encounter';
import { AbandonedAltarEncounter } from './data/abandoned_altar.encounter';
import { RugburnEncounter } from './data/rugburn.encounter';
import { TreeCarvingEncounter } from './data/tree_carving.encounter';
import { RunicBeehiveEncounter } from './data/runic_beehive';

@Injectable()
export class EncounterSeeder implements Seeder {
    constructor(
        @InjectModel(Encounter)
        private readonly encounter: ReturnModelType<typeof Encounter>,
    ) {}

    seed(): Promise<any> {
        return this.encounter.insertMany([
            AbandonedAltarEncounter,
            RugburnEncounter,
            NagpraEncounter,
            TreeCarvingEncounter,
            NaiadEncounter,
            WillowispEncounter,
            DancingSatyrEncounter,
            EnchantedForest,
            MossyTrollEncounter,
            YoungWizardEncounter,
            RunicBeehiveEncounter,
        ]);
    }
    async drop(): Promise<any> {
        return this.encounter.deleteMany({});
    }
}
