import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expedition } from './expedition.schema';
import { Model } from 'mongoose';
import { ExpeditionDocument } from 'src/types/expeditionDocument.type';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { CreateExpeditionDTO } from './dto/createExpedition.dto';
import { UpdateExpeditionDTO } from './dto/updateExpedition.dto';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
    ) {}

    async create(data: CreateExpeditionDTO): Promise<Expedition> {
        const expedition = new this.expedition(data);
        return expedition.save();
    }

    async updateExpeditionInProgressByPlayerId(
        player_id: string,
        data: UpdateExpeditionDTO,
    ): Promise<Expedition> {
        return await this.expedition.findOneAndUpdate(
            {
                player_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            data,
        );
    }

    async updateExpeditionInProgressByClientId(
        client_id: string,
        data: UpdateExpeditionDTO,
    ): Promise<Expedition> {
        return await this.expedition.findOneAndUpdate(
            {
                client_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            data,
        );
    }

    async playerHasAnExpedition(
        player_id: string,
        status: ExpeditionStatusEnum,
    ): Promise<boolean> {
        const itemExists = await this.expedition.exists({ player_id, status });
        return itemExists !== null;
    }

    async getActiveExpeditionByClientId(
        client_id: string,
    ): Promise<Expedition> {
        return await this.expedition.findOne({ client_id }).lean();
    }
}
