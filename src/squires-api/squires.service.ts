import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash } from 'crypto';
import axios from 'axios';
import { SquiresRewardResponse, SquiresRewardsResponse } from "./squires.types";
import { GearItem } from "src/playerGear/gearItem";

@Injectable()
export class SquiresService {
    constructor(
        private readonly configService:ConfigService
    ) {}


    async getAccountRewards(userAddress: string, equippedGear: GearItem[]): Promise<SquiresRewardResponse[]> {

        const squiresApiURL = this.configService.get<string>("SQUIRES_API_URL");
        const sharedSalt = this.configService.get<string>("GEARAPI_SALT");

        const timestamp = new Date().setUTCHours(0, 0, 0, 0).valueOf();
        const token = createHash('md5').update(timestamp + userAddress + sharedSalt).digest('hex');

        const gearIds = equippedGear.map((gear) => gear.gearId);

        try{
            const res = await axios.post<SquiresRewardsResponse>(
                squiresApiURL,
                {
                    wallet: userAddress,
                    token: token,
                    gear: gearIds
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if(res.status != 200){
                return [];
            }
            if(!res.data.success){
                return []
            }
    
            return res.data.rewards;
        }catch (error) {
            console.error("Error connecting to squires:", error.message);
            return [];
        }
        
    }

}