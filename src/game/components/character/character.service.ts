import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'kindagoose';
import { compact } from 'lodash';
import { GetCharacterDTO } from './character.dto';
import { Character } from './character.schema';
import { ConfigService } from '@nestjs/config';
import { AlchemyService } from 'src/nft-library/services/alchemy_service';

@Injectable()
export class CharacterService {
    constructor(
        @InjectModel(Character)
        private readonly character: ReturnModelType<typeof Character>,
        private readonly configService: ConfigService,
    ) {}

    async findAll(): Promise<Character[]> {
        return this.character.find({ isActive: true }).lean();
    }

    async findOne(payload: GetCharacterDTO): Promise<Character> {
        return this.character.findOne(payload).lean();
    }

    async getCharacterByContractId(idToFind: string): Promise<Character> {
        const net = this.getNetType();
        let filter = undefined;
        switch (net) {
            case AlchemyService.MAINNET:
                filter = { contractId: { $regex: idToFind, $options: "i" } };
                break;
            case AlchemyService.TESTNET:
                filter = { contractIdTest: { $regex: idToFind, $options: "i" } };
                break;
        }
        return this.character.findOne(filter).lean();
    }

    async findAllContractIds(): Promise<Array<string>> {
        const net = this.getNetType();

        const characters = await this.character.find(
            { isActive: true },
            { contractId: 1, contractIdTest: 1 },
        );
        
        if (characters.length === 0) return [];
        characters.forEach(character => {
            if(character?.characterClass == 'knight')
            {
                character.contractId = "0x16Ed951d479b87634d5E9e7C05a8316672A4c926";
                character.contractIdTest = "0x16Ed951d479b87634d5E9e7C05a8316672A4c926";
            }
        })
        switch (net) {
            case AlchemyService.MAINNET:
                return compact(characters.map((c) => c.contractId));
            case AlchemyService.TESTNET:
                return compact(characters.map((c) => c.contractIdTest));
            default:
                return [];
        }
    }

    private getNetType(): string {
        return this.configService.get('NFT_SERVICE_NET');
    }
}
