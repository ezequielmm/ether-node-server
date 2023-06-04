import { Controller, Get, Post, Body, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';

export class GetLeaderboardPayload {
    @ApiProperty()
    readonly addresses?: string[];

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate: Date;

    // @ApiProperty()
    // readonly pageSize?: number;

    // @ApiProperty()
    // readonly page?: number;

    @ApiProperty()
    readonly onlyWin?: Boolean
}

export interface IPaginationResponse{
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface ILeaderboardResponse {
    data: ILeaderboardItem[];
    pagination: IPaginationResponse;
}

export interface ILeaderboardItem {
    address: string;
    score: number;
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
    @Get('/')
    async getLeaderboard(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('pageSize', ParseIntPipe) pageSize: number,
        @Query('page', ParseIntPipe) page: number,
        @Query('onlyWin', ParseBoolPipe) onlyWin: boolean): Promise<ILeaderboardResponse> {
            
        console.log('--------------------------------------leaderboards--------------------------------------');
        console.log({ startDate, endDate, pageSize, page, onlyWin });
        
        const fStartDate:Date  = startDate ? new Date(startDate) : new Date();
        const fEndDate:Date    = endDate   ? new Date(endDate) : new Date();

        const totalItems = await this.leaderboardService.getLeaderboardCount({ fStartDate, fEndDate, onlyWin });

        const limit = (Math.abs(pageSize ?? 0)) > 0 ? (Math.abs(pageSize ?? 0))  : totalItems;
        const skip  = Math.abs(( page -1 ) * pageSize);
        
        const data = await this.leaderboardService.getLeaderboard({ fStartDate, fEndDate, limit, skip, onlyWin })
        const totalPages = (totalItems / pageSize) >= 1 ? (Math.ceil(totalItems / pageSize)) : 1;

        return  {
            data,
            pagination: {
                currentPage: page > totalPages ? totalPages : page,
                pageSize: pageSize,
                totalItems: totalItems,
                totalPages: totalPages
            }
        };
    }

    @ApiOperation({
        summary: 'Get Player Participation',
    })
    @Post('participation')
    async getParticipation(@Body() payload: GetLeaderboardPayload): Promise<ILeaderboardParticipationItem[]> {
        console.log("--------------------------------------participation--------------------------------------");
        console.log(payload);

        payload.startDate = payload.startDate ? new Date(payload.startDate) : new Date();
        payload.endDate   = payload.endDate   ? new Date(payload.endDate) : new Date();
        
        return await this.leaderboardService.getParticipation(payload)
    }

    @ApiOperation({
        summary: 'Get Users Highest Scores',
    })
    @Post('scores')
    async getHighScores(@Body() payload: GetLeaderboardPayload): Promise<ILeaderboardScoreItem[]>  {
        console.log('--------------------------------------scores--------------------------------------');
        console.log(payload)

        payload.startDate = payload.startDate ? new Date(payload.startDate) : new Date();
        payload.endDate   = payload.endDate   ? new Date(payload.endDate) : new Date();

        return await this.leaderboardService.getHighScores(payload);
    }
}
