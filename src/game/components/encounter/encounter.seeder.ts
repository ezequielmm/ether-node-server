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
import { OddbarksEncounter } from './data/oddbarks.encounter';
import { CaveInEncounter } from './data/cave_in.encounter';
import { StoneMansonEncounter } from './data/stone_mason.encounter';
import { RoyalEmissaryEncounter } from './data/royal_emissary.encounter';
import { StalactiteEncounter } from './data/mesmerizing_stalactite.encounter';
import { StoneCuttersEncounter } from './data/stone_cutters.encounter';

@Injectable()
export class EncounterSeeder implements Seeder {
    constructor(
        @InjectModel(Encounter)
        private readonly encounter: ReturnModelType<typeof Encounter>,
    ) {}

    async seed(): Promise<any> {
        return await this.encounter.insertMany([
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
            OddbarksEncounter,
            RunicBeehiveEncounter,
            CaveInEncounter,
            StoneMansonEncounter,
            RoyalEmissaryEncounter,
            StalactiteEncounter,
            StoneCuttersEncounter,

        ]);
    }
    async drop(): Promise<any> {
        return await this.encounter.deleteMany({});
    }
}
