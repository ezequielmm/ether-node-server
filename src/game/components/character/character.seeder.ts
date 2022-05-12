import { Injectable } from '@nestjs/common';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Character, CharacterDocument } from './character.schema';
import { Model } from 'mongoose';

@Injectable()
export class CharacterSeeder implements Seeder {
    constructor(
        @InjectModel(Character.name)
        private readonly character: Model<CharacterDocument>,
    ) {}

    async seed(): Promise<any> {
        const character = DataFactory.createForClass(Character).generate(1);
        return this.character.create(character);
    }

    async drop(): Promise<any> {
        return this.character.deleteMany({});
    }
}
