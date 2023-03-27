import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Contest } from 'src/game/contest/contest.schema';
import { ContestService } from 'src/game/contest/contest.service';

@ApiTags('showContest')
@Controller('showContest')
export class ShowContestController {
    constructor(private readonly contestService: ContestService) {}

    @ApiOperation({ summary: 'Show version' })
    @Get('/')
    async getVersion(): Promise<Contest> {
        return await this.contestService.findActiveContest();
    }
}
