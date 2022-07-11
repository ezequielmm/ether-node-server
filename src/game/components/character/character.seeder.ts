import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Character, CharacterDocument } from './character.schema';
import { Model } from 'mongoose';
import { CharacterData } from './character.data';

@Injectable()
export class CharacterSeeder implements Seeder {
    constructor(
        @InjectModel(Character.name)
        private readonly character: Model<CharacterDocument>,
    ) {}

    async seed(): Promise<any> {
        return this.character.create(CharacterData);
    }

    async drop(): Promise<any> {
        return this.character.deleteMany({});
    }
}
