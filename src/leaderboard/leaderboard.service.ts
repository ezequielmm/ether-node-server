import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { GetLeaderboardPayload, ILeaderboardParticipationItem, ILeaderboardScoreItem } from './leaderboard.controller';
import { Expedition } from 'src/game/components/expedition/expedition.schema';
import { ExpeditionStatusEnum } from 'src/game/components/expedition/expedition.enum';

@Injectable()
export class LeaderboardService {
    constructor(
        @InjectModel(Expedition)
        private readonly expedition: ReturnModelType<typeof Expedition>,
    ) {}

    normalizeDates({ startDate, endDate }: { startDate: Date; endDate: Date; }): { start: Date; end: Date; } {
        startDate.setUTCHours(0,0,0,0);
        endDate.setUTCHours(23,59,59,999);
        return { start: startDate, end: endDate };
    }

    async getParticipation(payload: GetLeaderboardPayload): Promise<ILeaderboardParticipationItem[]> {
        const result: ILeaderboardParticipationItem[] = [];
        const { startDate, endDate, addresses, onlyWin, limit, skip } = payload;
       /* const newStartDate = new Date(startDate.toISOString());
        const newEndDate = new Date(endDate.toISOString());
        const dates = {
            startDate: newStartDate,
            endDate: newEndDate
        }*/
       // let { start, end } = this.normalizeDates({ startDate, endDate });
       // const { start, end } = this.normalizeDates({ startDate, endDate });
        const match = {
            createdAt: { 
                $gte: startDate, 
                $lte: endDate 
            }
        };

        if (onlyWin) {
            match['status'] = ExpeditionStatusEnum.Victory;
        } else {
            match['status'] = { $in: [ExpeditionStatusEnum.Victory, ExpeditionStatusEnum.Defeated]};
        }

        if (addresses && addresses.length) {
            match["playerState.walletId"] = { $in: addresses };
        }

        return await this.expedition.aggregate([
            {
                $match: match
            },
            {
                $setWindowFields: {
                    partitionBy: {
                        wallet: "$playerState.walletId",
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
                        wallet: "$playerState.walletId",
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
            },
            { $sort: {daysPlayed: -1 }},
            { $skip: skip ?? 0 },
            { $limit: limit ?? 500 }
        ]);
    }

    async getHighScores({ addresses, startDate, endDate, limit, skip, onlyWin }: {
        addresses: string[];
        startDate: Date;
        endDate: Date;
        limit?: number;
        skip?: number;
        onlyWin?: boolean;
    }): Promise<ILeaderboardScoreItem[]>  {
        const result: ILeaderboardScoreItem[] = [];

       /* const newStartDate = new Date(startDate.toISOString());
        const newEndDate = new Date(endDate.toISOString());
        const dates = {
            startDate: newStartDate,
            endDate: newEndDate
        }
        */

       // let { start, end } = this.normalizeDates({ startDate, endDate });

        const match = {
                createdAt: { 
                    $gte: startDate, 
                    $lte: endDate 
                },
                finalScore: { $exists: true },
            };

        if (onlyWin) {
            match['status'] = ExpeditionStatusEnum.Victory;
        }

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
            { $sort: { highScore: -1 }},
            { $skip: skip ?? 0 },
            { $limit: limit ?? 500 }
        ]);

    }

}

