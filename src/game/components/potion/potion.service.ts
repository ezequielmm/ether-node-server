import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Potion, PotionDocument } from './potion.schema';
import { Model } from 'mongoose';

@Injectable()
export class PotionService {
    constructor(
        @InjectModel(Potion.name)
        private readonly potion: Model<PotionDocument>,
    ) {}

    async findAll(): Promise<PotionDocument[]> {
        return this.potion.find().lean();
    }
}
