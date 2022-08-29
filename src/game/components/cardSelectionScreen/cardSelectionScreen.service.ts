import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CreateCardSelectionScreenDTO,
    IFindCardSelectionScreen,
} from './cardSelectionScreen.interface';
import {
    CardSelectionScreen,
    CardSelectionScreenDocument,
} from './cardSelectionScreen.schema';

@Injectable()
export class CardSelectionScreenService {
    constructor(
        @InjectModel(CardSelectionScreen.name)
        private readonly cardSelectionScreen: Model<CardSelectionScreenDocument>,
    ) {}

    async create(
        payload: CreateCardSelectionScreenDTO,
    ): Promise<CardSelectionScreenDocument> {
        return await this.cardSelectionScreen.create(payload);
    }

    async deleteByClientId(clientId: string): Promise<void> {
        await this.cardSelectionScreen.deleteMany({ clientId });
    }

    async findOne(
        payload: IFindCardSelectionScreen,
    ): Promise<CardSelectionScreenDocument> {
        return await this.cardSelectionScreen.findOne(payload).lean();
    }
}
