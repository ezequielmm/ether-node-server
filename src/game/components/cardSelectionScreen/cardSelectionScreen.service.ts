import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Model } from 'mongoose';
import {
    CreateCardSelectionScreenDTO,
    IFindCardSelectionScreenDTO,
    UpdateCardSelectionScreenDTO,
} from './cardSelectionScreen.interface';
import {
    CardSelectionScreen
} from './cardSelectionScreen.schema';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class CardSelectionScreenService {
    constructor(
        @InjectModel(CardSelectionScreen)
        private readonly cardSelectionScreen: ReturnModelType<typeof CardSelectionScreen>,
    ) { }

    async create(
        payload: CreateCardSelectionScreenDTO,
    ): Promise<CardSelectionScreen> {
        return await this.cardSelectionScreen.create(payload);
    }

    async deleteByClientId(clientId: string): Promise<void> {
        await this.cardSelectionScreen.deleteMany({ clientId });
    }

    async findOne(
        payload: IFindCardSelectionScreenDTO,
    ): Promise<CardSelectionScreen> {
        return await this.cardSelectionScreen.findOne(payload).lean();
    }

    async update(payload: UpdateCardSelectionScreenDTO): Promise<void> {
        const { clientId } = payload;
        await this.cardSelectionScreen.updateOne(
            { clientId },
            { $set: payload },
        );
    }
}
