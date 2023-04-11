import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectModel } from 'kindagoose';
import { Character } from './character.schema';
import { CharacterData } from './character.data';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class CharacterSeeder implements Seeder {
    constructor(
        @InjectModel(Character)
        private readonly character: ReturnModelType<typeof Character>,
    ) {}

    async seed(): Promise<any> {
        return await this.character.create(CharacterData);
    }

    async drop(): Promise<any> {
        return await this.character.deleteMany({});
    }
}
