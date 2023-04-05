import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';

class GetLeaderboardPayload {
    @ApiProperty()
    readonly addresses: string[];

    @ApiProperty()
    readonly startDate: Date;

    @ApiProperty()
    readonly endDate: Date;
}

export interface IParticipationResponse {
    address: string;
    daysPlayed: number;
}

export interface ILeaderboardScoreResponse {
    address: string;
    score: number;
}


@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
    constructor(private leaderboardService: LeaderboardService) {}

    @ApiOperation({
        summary: 'Get Leaderboard',
    })
    @Get('scores')
    async getHighScores(
        @Param('startDate') startDate: Date,
        @Param('endDate') endDate: Date,
        @Param('addresses') addresses: string[] = [],
        @Param('limit') limit: number = 500
    ): Promise<ILeaderboardScoreResponse[]>  {
        return await this.leaderboardService.getHighScores({
            start: startDate,
            end: endDate,
            addresses,
            limit
        });
    }

    @ApiOperation({
        summary: 'Get Player Participation',
    })
    @Post('participation')
    async getParticipation(
        @Body() payload: GetLeaderboardPayload,
    ): Promise<IParticipationResponse[]> {
        return await this.leaderboardService.getParticipation({
            addresses: payload.addresses,
            start: payload.startDate,
            end: payload.endDate, 
        });
    }

}
