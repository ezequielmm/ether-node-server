import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character, CharacterDocument } from './character.schema';

@Injectable()
export class CharacterService {
    constructor(
        @InjectModel(Character.name)
        private readonly character: Model<CharacterDocument>,
    ) {}

    async findAll(): Promise<CharacterDocument[]> {
        return this.character.find().exec();
    }
}
