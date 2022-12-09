import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Seeder } from 'nestjs-seeder';
import { Card } from './card.schema';
import { data } from './card.data';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class CardSeeder implements Seeder {
    constructor(
        @InjectModel(Card) private readonly card: ReturnModelType<typeof Card>,
    ) {}

    async seed(): Promise<any> {
        return this.card.insertMany(data);
    }

    async drop(): Promise<any> {
        return this.card.deleteMany({});
    }
}
