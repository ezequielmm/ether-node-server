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

    async getLeaderboardCount({fStartDate, fEndDate, onlyWin} : {fStartDate: Date, fEndDate: Date, onlyWin:boolean}) : Promise<number>{
        const match = this.getWhereConditions({fStartDate, fEndDate, onlyWin});

        const count = await this.expedition.countDocuments(match);
        
        return count;
    }

    async getLeaderboard({ fStartDate, fEndDate, limit, skip, onlyWin } : { fStartDate: Date, fEndDate: Date, limit: number, skip: number, onlyWin: boolean }): Promise<any[]>{
        //let result: ILeaderboardItem[] = [];

        const match = this.getWhereConditions({fStartDate, fEndDate, onlyWin});

        return await this.expedition.aggregate([
            {   $match: match },
            {
                $project: {
                    _id: 0,
                    address: "$userAddress",
                    score: "$scores",
                    endedAt: 1,
                    finalScore: 1,  // Include the finalScore field
                    totalTime: { $subtract: ["$endedAt", "$createdAt"] }
                }
            },
            { $sort: { score: -1, endedAt: -1 }},
            { $skip: skip },
            { $limit: limit }
        ]);
    }

    async getParticipation(payload: GetLeaderboardPayload): Promise<ILeaderboardParticipationItem[]> {
        let result: ILeaderboardParticipationItem[] = [];
        
        const { startDate, endDate, addresses, onlyWin } = payload;

        const fStartDate = startDate;
        const fEndDate   = endDate;
        const { start, end } = this.normalizeDates({ fStartDate, fEndDate });
        
        // const limit = pageSize ?? 0;
        // const skip  = ( (page ?? 1) -1 ) * pageSize;

        const match = {
            createdAt: { 
                $gte: start, 
                $lte: end 
            }
        };

        if (onlyWin) {
            match['status'] = ExpeditionStatusEnum.Victory;
        } else {
            match['status'] = { $in: [ExpeditionStatusEnum.Victory, ExpeditionStatusEnum.Defeated]};
        }

        if (addresses && addresses.length) {
            match["playerState.playerToken.walletId"] = { $in: addresses };
        }

        result = await this.expedition.aggregate([
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
                    sortBy: { "day": -1 }, //day
                    output: {
                        daysPlayed: { 
                            $sum: 1,
                            window: {
                                documents: ["unbounded","current"] // range: [unbounded, current]
                            }
                        }
                    }
                }
            },

            //- 

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

            //- 

            {
                $group: {
                    _id: "$_id.wallet",
                    daysPlayed: { $count: {} }
                }
            },

            //- 

            {
                $project: {
                    _id: 0,
                    address: "$_id",
                    daysPlayed: 1,
                }
            },
            { $sort: { daysPlayed: -1 }},
            // { $skip: skip ?? 0 },
            // { $limit: limit ?? 500 }
        ]);

        return result;
    }

    async getHighScores(payload: GetLeaderboardPayload): Promise<ILeaderboardScoreItem[]>  {
        let result: ILeaderboardScoreItem[] = [];
        const { startDate, endDate, addresses, onlyWin } = payload;

        const fStartDate = startDate;
        const fEndDate   = endDate;
        const { start, end } = this.normalizeDates({ fStartDate, fEndDate });

        // const limit = pageSize ?? 0;
        // const skip  = ( (page ?? 1) -1 ) * pageSize;

        const match = {
            createdAt: { 
                $gte: start, 
                $lte: end 
            },
            finalScore: { $exists: true },
        };

        if (onlyWin) {
            match['status'] = ExpeditionStatusEnum.Victory;
        } else {
            match['status'] = { $in: [ExpeditionStatusEnum.Victory, ExpeditionStatusEnum.Defeated]};
        }

        if (addresses && addresses.length) {
            match["playerState.playerToken.walletId"] = { $in: addresses };
        }

        result = await this.expedition.aggregate([
            {   $match: match },
            {
                $group: {
                    _id: "$playerState.playerToken.walletId",
                    score: { $max: "$finalScore.totalScore" },
                }
            },
            {
                $project: {
                    _id: 0,
                    address: "$_id",
                    score: 1,
                }
            },
            { $sort: { score: -1 }},
            // { $skip: skip ?? 0 },
            // { $limit: limit ?? 500 }
        ]);

        return result;
    }

    getWhereConditions({fStartDate, fEndDate, onlyWin} : {fStartDate: Date, fEndDate: Date, onlyWin:boolean}){
        const match = {
            createdAt: { 
                $gte: fStartDate
            },
            endedAt: {
                $lte: fEndDate 
            },
            finalScore: { $exists: true },
        };

        if (onlyWin) {
            match['status'] = ExpeditionStatusEnum.Victory;
        } else {
            match['status'] = { $in: [ExpeditionStatusEnum.Victory, ExpeditionStatusEnum.Defeated]};
        }

        return match;
    }

    normalizeDates({ fStartDate, fEndDate }: { fStartDate: Date; fEndDate: Date; }): { start: Date; end: Date; } {
        fStartDate.setUTCHours(0,0,0,0);
        fEndDate.setUTCHours(23,59,59,999);
        return { start: fStartDate, end: fEndDate };
    }

}

