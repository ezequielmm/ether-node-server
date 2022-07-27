import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Seeder } from 'nestjs-seeder';
import { Card, CardDocument } from './card.schema';
import { Model } from 'mongoose';
import { data } from './card.data';

@Injectable()
export class CardSeeder implements Seeder {
    constructor(
        @InjectModel(Card.name) private readonly card: Model<CardDocument>,
    ) {}

    async seed(): Promise<any> {
        return this.card.insertMany(data);
    }

    async drop(): Promise<any> {
        return this.card.deleteMany({});
    }
}
