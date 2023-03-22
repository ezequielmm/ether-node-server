import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { last } from 'lodash';
import { ContestService } from 'src/game/contest/contest.service';
import { ContestMapService } from 'src/game/contestMap/contestMap.service';
import { MapService } from 'src/game/map/map.service';
import buildActOne from 'src/game/map/act/act-one/index';

@Injectable()
export class TaskService {
    private readonly logger: Logger = new Logger(TaskService.name);

    constructor(
        private readonly mapService: MapService,
        private readonly contestService: ContestService,
        private readonly contestMapService: ContestMapService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
        name: 'Create Contest Map',
        timeZone: 'UTC',
    })
    async handleMapCreation(): Promise<void> {
        this.logger.log(
            'Checking if we need to create a new map for today contest...',
        );

        // First we query the database to confirm if we have a map contest
        // for today
        const contest = await this.contestService.findActive();

        // If we have a contest, we don't need to create a new map
        if (contest) {
            this.logger.log('We have a contest for today, skipping...');
            return;
        }

        // We get the current date
        const now = new Date();
        now.setUTCHours(0, 0, 0, 0);

        // If we don't have a contest, we generate the first map
        // and create a contest for it, first we generate act 0
        const map = this.mapService.getActZero();

        // Now we generate the rest of nodes for the map
        // First we we the last node id to keep it consistent
        const lastNodeId = last(map)?.id ?? 0;

        // Now we generate the rest of the nodes
        const nodes = buildActOne(lastNodeId + 1);

        // Now we add the nodes to the map
        map.push(...nodes);

        // We create the map first
        const contestMap = await this.contestMapService.create({
            name: `Autogenerated map ${now.getTime()}`,
            nodes: map,
        });

        // Now we get the last event_id from the database, this filed is used to
        // show the map on the admin panel calendar
        const event_id = await this.contestService.getLastEventId();

        // Now we schedule the contest to the day
        await this.contestService.create({
            map_id: contestMap.id,
            event_id: event_id + 1,
            available_at: now,
        });

        this.logger.log(
            `Created a new map ${contestMap.name} and contest for today!`,
        );
    }
}
