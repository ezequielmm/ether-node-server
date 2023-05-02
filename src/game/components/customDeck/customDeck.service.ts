import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { CustomDeck } from './customDeck.schema';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class CustomDeckService {
    constructor(
        @InjectModel(CustomDeck)
        private readonly customDeck: ReturnModelType<typeof CustomDeck>,
    ) {}

    async findByUserAddress(userAddress: string): Promise<CustomDeck> {
        return await this.customDeck
            .findOne({ userAddress, isDefault: true })
            .lean();
    }
}
