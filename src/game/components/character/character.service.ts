import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'kindagoose';
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
}
