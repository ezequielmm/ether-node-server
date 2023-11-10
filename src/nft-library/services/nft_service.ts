import { AlchemyService } from './alchemy_service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NFTService {

    constructor(private readonly alchemyService: AlchemyService){}

    public async isTokenIdFromWallet(contract:string, tokenId: number, walletAddress: string): Promise<boolean>{
        let NFTOwnedByWallet = false;
        const owners = await this.getOwnersForTokenAndContract(contract, tokenId);

        const lowercaseOwners = owners.map((owner) => owner.toLowerCase());
        const lowercaseWalletAddress = walletAddress.toLowerCase();

        if (lowercaseOwners.includes(lowercaseWalletAddress)) {
            NFTOwnedByWallet = true;
        }

        return NFTOwnedByWallet;
    }

    private async getOwnersForTokenAndContract(contract: string, tokenId: number): Promise<string[]> {
        try{
            return (await this.alchemyService.getInstance().nft.getOwnersForNft(contract, tokenId)).owners;
        }catch(error) {
            console.error("Error connecting to alchemy api:", error.message);
            return Promise.resolve([]);
        }
    }

}


