
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'kindagoose';
import { Seeder } from 'nestjs-seeder';
import { ContestMap } from './contestMap.schema';
import buildActOne from 'src/game/map/act/act-one/index';
import { addHoursToDate, setHoursMinutesSecondsToUTCDate } from 'src/utils';
import { ContestService } from '../contest/contest.service';
import { MapPopulationService } from '../map/mapPopulation.service';
import { mongoose } from '@typegoose/typegoose';

@Injectable()
export class ContestMapSeeder implements Seeder {
    constructor(
        @InjectModel(ContestMap)
        private readonly contestMap: ReturnModelType<typeof ContestMap>,
        private readonly mapPopulationService: MapPopulationService,
        private readonly contestService: ContestService,
    ) {
        // mongoose.set('debug', true);
    }

    async seed(): Promise<any> {
        const map = await this.mapPopulationService.populateNodes(buildActOne());

        const contestMap = await this.contestMap.create({
            name: 'Default Contest Map',
            nodes: map,
        });

        const today = new Date();
        const availableAt = setHoursMinutesSecondsToUTCDate(today);
        const endsAt = setHoursMinutesSecondsToUTCDate(
            availableAt,
            23,
            59,
            59,
            999,
        );
        const validUntil = addHoursToDate(endsAt, 6);

        const event_id = await this.contestService.getLastEventId();

        // Now we schedule the contest to the day
        await this.contestService.create({
            map_id: contestMap.id,
            event_id: event_id + 1,
            available_at: availableAt,
            ends_at: endsAt,
            valid_until: validUntil,
        });
        
        return contestMap;
    }

    async drop(): Promise<any> {
        await this.contestService.deleteMany({});
        return await this.contestMap.deleteMany({});
    }
}
