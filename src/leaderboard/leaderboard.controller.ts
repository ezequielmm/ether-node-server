import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';

export class GetLeaderboardPayload {
    @ApiProperty()
    readonly addresses?: string[];

    @ApiProperty()
    readonly startDate: Date;

    @ApiProperty()
    readonly endDate: Date;

    @ApiProperty()
    readonly onlyWin?: Boolean

    @ApiProperty()
    readonly limit?: number;

    @ApiProperty()
    readonly skip?: number;
}

export interface ILeaderboardResponse {
    data: ILeaderboardParticipationItem[] | ILeaderboardScoreItem[];
}

export interface ILeaderboardParticipationItem {
    address: string;
    daysPlayed: number;
}

export interface ILeaderboardScoreItem {
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
        @Param('limit') limit: number = 500,
        @Param('skip') skip: number = 0,
        @Param('onlyWin') onlyWin: boolean = false,
    ): Promise<ILeaderboardResponse>  {
        return { 
            data: await this.leaderboardService.getHighScores({
                    startDate,
                    endDate,
                    addresses,
                    limit,
                    skip,
                    onlyWin,
                })
        };
        
    }

    @ApiOperation({
        summary: 'Get Player Participation',
    })
    @Post('participation')
    async getParticipation(
        @Body() payload: GetLeaderboardPayload,
    ): Promise<ILeaderboardResponse> {
        return {
            data: await this.leaderboardService.getParticipation(payload)
        };
    }
}
