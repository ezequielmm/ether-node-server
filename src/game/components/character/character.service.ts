import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'kindagoose';
import { compact } from 'lodash';
import { GetCharacterDTO } from './character.dto';
import { Character } from './character.schema';
import { ConfigService } from '@nestjs/config';

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
        const chain = this.getChainId();
        let filter = undefined;
        switch (chain) {
            case 1:
            filter = { contractId: { $regex: idToFind, $options: "i" } };
                break;
            case 5:
                filter = { contractIdTest: { $regex: idToFind, $options: "i" } };
                break;
        }
        return this.character.findOne(filter).lean();
    }

    async findAllContractIds(): Promise<Array<string>> {
        const chain = this.getChainId();

        const characters = await this.character.find(
            { isActive: true },
            { contractId: 1, contractIdTest: 1 },
        );

        if (characters.length === 0) return [];

        switch (chain) {
            case 1:
                return compact(characters.map((c) => c.contractId));
            case 5:
                return compact(characters.map((c) => c.contractIdTest));
            default:
                return [];
        }
    }

    private getChainId(): number {
        return Number(this.configService.get('NFT_SERVICE_CHAIN_ID'));
    }
}
