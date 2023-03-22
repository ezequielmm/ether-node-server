import { Controller, Get, Param, Query } from '@nestjs/common';
import { ExpeditionService } from '../game/components/expedition/expedition.service';
import { ContestService } from '../game/contest/contest.service';

@Controller('highscore')
export class HighscoreController {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private contestService: ContestService,
    ) {}
    @Get('/')
    async getHighscrores(@Query('limit') limit: number): Promise<any> {
        if (!limit) limit = 10;
        const contest = await this.contestService.findActive();
        const who = await this.expeditionService.findTopScores(
            contest.event_id,
            limit,
        );
        return who;
    }
}
