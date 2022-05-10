import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Card, CardDocument } from './card.schema';
import { Model } from 'mongoose';

@Injectable()
export class CardSeeder implements Seeder {
    constructor(
        @InjectModel(Card.name) private readonly card: Model<CardDocument>,
    ) {}

    async seed(): Promise<any> {
        const cards = DataFactory.createForClass(Card).generate(15);
        return this.card.insertMany(cards);
    }

    async drop(): Promise<any> {
        return this.card.deleteMany({});
    }
}
