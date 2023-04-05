import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { IParticipationResponse, ILeaderboardScoreResponse } from './leaderboard.controller';
import { Expedition } from 'src/game/components/expedition/expedition.schema';

@Injectable()
export class LeaderboardService {
    constructor(
        @InjectModel(Expedition)
        private readonly expedition: ReturnModelType<typeof Expedition>,
    ) {}

    normalizeDates({ start, end }: { start: Date; end: Date; }): { start: Date; end: Date; } {
        start.setUTCHours(0,0,0,0);
        end.setUTCHours(23,59,59,999);
        return { start, end };
    }

    async getParticipation({ start, end, addresses }: { 
        addresses: string[];
        start: Date; 
        end: Date;
    }): Promise<IParticipationResponse[]> {
        const result: IParticipationResponse[] = [];
        
        const { start: startDate, end: endDate } = this.normalizeDates({start, end});

        const match = {
            createdAt: { 
                $gte: startDate, 
                $lte: endDate 
            }
        };

        if (addresses && addresses.length) {
            match["$playerState.playerToken.walletId"] = { $in: addresses };
        }

        return await this.expedition.aggregate([
            {
                $match: match
            },
            {
                $setWindowFields: {
                    partitionBy: {
                        wallet: "$playerState.playerToken.walletId",
                        day: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        } 
                    },
                    sortBy: { "day": -1 },
                    output: {
                        daysPlayed: { 
                            $sum: 1,
                            window: {
                                range: ["unbounded","current"]
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        wallet: "$playerState.playerToken.walletId",
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.wallet",
                    daysPlayed: { $count: {} }
                }
            },
            {
                $project: {
                    _id: 0,
                    daysPlayed: 1,
                    walletAddress: "$_id",
                }
            }
        ]);
    }

    async getHighScores({ addresses, start, end, limit }: {
        addresses: string[];
        start: Date;
        end: Date;
        limit?: number;
    }): Promise<ILeaderboardScoreResponse[]>  {
        const result: ILeaderboardScoreResponse[] = []
        const { start: startDate, end: endDate } = this.normalizeDates({start, end});

        const match = {
                createdAt: { 
                    $gte: startDate, 
                    $lte: endDate 
                },
                finalScore: { $exists: true },
            };

        if (addresses && addresses.length) {
            match["$playerState.playerToken.walletId"] = { $in: addresses };
        }

        return await this.expedition.aggregate([
            {   $match: match },
            {
                $group: {
                    _id: "$playerState.playerToken.walletId",
                    highScore: { $max: "$finalScore.totalScore" },
                }
            },
            {
                $project: {
                    _id: 0,
                    walletAddress: "$_id",
                    highScore: 1,
                }
            },
            { $limit: limit ?? 500 }
        ]);
    }

}

