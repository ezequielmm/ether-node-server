import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trinket, TrinketDocument } from './trinket.schema';

@Injectable()
export class TrinketService {
    constructor(
        @InjectModel(Trinket.name)
        private readonly trinket: Model<TrinketDocument>,
    ) {}

    async findAll(): Promise<TrinketDocument[]> {
        return this.trinket.find().lean();
    }
}
