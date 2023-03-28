import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'kindagoose';
import { compact } from 'lodash';
import { GetCharacterDTO } from './character.dto';
import { Character } from './character.schema';

@Injectable()
export class CharacterService {
    constructor(
        @InjectModel(Character)
        private readonly character: ReturnModelType<typeof Character>,
    ) {}

    async findAll(): Promise<Character[]> {
        return this.character.find({ isActive: true }).lean();
    }

    async findOne(payload: GetCharacterDTO): Promise<Character> {
        return this.character.findOne(payload).lean();
    }

    async getCharacterByContractId(idToFind: string): Promise<Character> {
        const chain = Number(process.env.NFT_SERVICE_CHAIN_ID);
        let filter = undefined;
        switch (chain) {
            case 1:
                filter = { contractId: idToFind };
                break;
            case 5:
                filter = { contractIdTest: idToFind };
                break;
        }
        return this.character.findOne(filter).lean();
    }

    async findAllContractIds(): Promise<Array<string>> {
        const chain = Number(process.env.NFT_SERVICE_CHAIN_ID);

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
}
