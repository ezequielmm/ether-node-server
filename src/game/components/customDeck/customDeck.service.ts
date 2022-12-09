import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { CustomDeck } from './customDeck.schema';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class CustomDeckService {
    constructor(
        @InjectModel(CustomDeck)
        private readonly customDeck: ReturnModelType<typeof CustomDeck>,
    ) {}

    async findByEmail(email: string): Promise<CustomDeck> {
        return await this.customDeck.findOne({ email, isDefault: true }).lean();
    }
}
