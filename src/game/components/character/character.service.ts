import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character, CharacterDocument } from './character.schema';
import { GetCharacterDTO } from './character.dto';

@Injectable()
export class CharacterService {
    constructor(
        @InjectModel(Character.name)
        private readonly character: Model<CharacterDocument>,
    ) {}

    async findAll(): Promise<CharacterDocument[]> {
        return this.character.find({ isActive: true }).lean();
    }

    async findOne(payload: GetCharacterDTO): Promise<CharacterDocument> {
        return this.character.findOne(payload).lean();
    }
}
