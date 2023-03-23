import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'kindagoose';
import { last } from 'lodash';
import { Seeder } from 'nestjs-seeder';
import { MapService } from '../map/map.service';
import { ContestMap } from './contestMap.schema';
import buildActOne from 'src/game/map/act/act-one/index';
import { addHoursToDate, setHoursMinutesSecondsToUTCDate } from 'src/utils';
import { ContestService } from '../contest/contest.service';

@Injectable()
export class ContestMapSeeder implements Seeder {
    constructor(
        @InjectModel(ContestMap)
        private readonly contestMap: ReturnModelType<typeof ContestMap>,
        private readonly mapService: MapService,
        private readonly contestService: ContestService,
    ) {}

    async seed(): Promise<any> {
        const map = this.mapService.getActZero();

        const lastNodeId = last(map)?.id ?? 0;

        const nodes = buildActOne(lastNodeId + 1);

        map.push(...nodes);

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
        await this.contestService.deleteMany();
        return this.contestMap.deleteMany({});
    }
}
