import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'kindagoose';
import { Seeder } from 'nestjs-seeder';
import { ContestMap } from './contestMap.schema';
import buildActOne from 'src/game/map/act/act-one/index';
import {
    addHoursToDate,
    countSteps,
    findStepWithMostNodes,
    setHoursMinutesSecondsToUTCDate,
} from 'src/utils';
import { ContestService } from '../contest/contest.service';
import { MapPopulationService } from '../map/mapPopulation.service';

@Injectable()
export class ContestMapSeeder implements Seeder {
    constructor(
        @InjectModel(ContestMap)
        private readonly contestMap: ReturnModelType<typeof ContestMap>,
        private readonly mapPopulationService: MapPopulationService,
        private readonly contestService: ContestService,
    ) {}

    defaultName = 'Default Contest Map';

    async seed(): Promise<any> {
        
        const map = await this.mapPopulationService.populateNodes(
            buildActOne(),
        );

        // Here we calculate how many steps we have in the map
        const maxSteps = countSteps(map);
        const maxNodes = findStepWithMostNodes(map);

        const contestMap = await this.contestMap.create({
            name: this.defaultName,
            nodes: map,
            maxSteps,
            maxNodes,
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

        // const today = new Date();
        // const availableAt = setHoursMinutesSecondsToUTCDate(today);
        // const endsAt = setHoursMinutesSecondsToUTCDate(
        //     availableAt,
        //     23,
        //     59,
        //     59,
        //     999,
        // );

        // const mapFound = await this.contestService.findOne({
        //     name: this.defaultName,
        //     created_at: { $gte: availableAt },
        //     ends_at: { $lte: endsAt }
        // });

        // if (mapFound) {
        //     await this.contestService.deleteMany({map_id: mapFound.id });
        //     return await this.contestMap.deleteMany({ _id: mapFound.id });
        // }
        // return;
    }
}
