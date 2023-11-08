import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash } from 'crypto';
import axios from 'axios';
import { GetNftsByWalletResponse, InProgressBridgeResponse, InitiationBridgeResponse, InitiationRequestDTO } from "./bridge.types";

@Injectable()
export class BridgeService {
    constructor(
        private readonly configService:ConfigService
    ) {}

    async isTokenIdInProgress(tokenId:number, contract:string): Promise<boolean>{
        const bridgeApiURL = this.configService.get<string>("BRIDGE_API_URL");

        try{
            const res = await axios.post<InProgressBridgeResponse>(
                `${bridgeApiURL}/inprogress`,
                {
                    ids: [tokenId],
                    contract: contract
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if(res.status != 200){
                return true;
            }

            if(res.data.inProgress.length > 0){
                return true;
            }

            return false;

        }catch (error) {
            console.error("Error connecting to bridge api:", error.message);
            throw new BadRequestException("Error connecting to bridge api.");
        }
    }

    async createInititation(initiationRequest:InitiationRequestDTO): Promise<InitiationBridgeResponse> {

        const bridgeApiURL = this.configService.get<string>("BRIDGE_API_URL");
        const sharedSalt   = this.configService.get<string>("GEARAPI_SALT");

        const timestamp = new Date().setUTCHours(0, 0, 0, 0).valueOf();
        const token = createHash('md5').update(timestamp + initiationRequest.wallet + sharedSalt).digest('hex');

        try{
            const res = await axios.post<InitiationBridgeResponse>(
                `${bridgeApiURL}/initiation`,
                {
                    tokenId: initiationRequest.tokenId,
                    contract: initiationRequest.contract,
                    gearIds: initiationRequest.gearIds,
                    wallet: initiationRequest.wallet,
                    token: token
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if(res.status != 200){
                return {success: false, message: "Wrong Bridge API endpoint"};
            }
            return res.data;
    
        }catch (error) {
            console.error("Error connecting to bridge api:", error.message);
            return {success: false, message: "Error connecting to Bridge API"};
        }
    }

    async getNftsByWallet(walletAddress: string, amount: number = 10, skip:number = 0): Promise<GetNftsByWalletResponse>{
        const bridgeApiURL = this.configService.get<string>("BRIDGE_API_URL");

        try{
            const res = await axios.get(
                `${bridgeApiURL}/walletnfts/${walletAddress}/${amount}/${skip}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if(res.status != 200){
                console.log("Error connecting to Bridge API: " + res.status);
            }

            console.log("Raw response from Squires:")
            console.log(res.data);

            return res.data;

        }catch (error){
            console.error("Error connecting to bridge api:", error.message);
        }
    }

}