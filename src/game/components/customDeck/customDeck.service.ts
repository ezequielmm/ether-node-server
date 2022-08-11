import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomDeck, CustomDeckDocument } from './customDeck.schema';

@Injectable()
export class CustomDeckService {
    constructor(
        @InjectModel(CustomDeck.name)
        private readonly customDeck: Model<CustomDeckDocument>,
    ) {}

    async findByEmail(email: string): Promise<CustomDeckDocument> {
        return await this.customDeck.findOne({ email, isDefault: true }).lean();
    }
}
