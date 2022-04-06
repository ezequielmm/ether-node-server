import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expedition } from './expedition.schema';
import { Model } from 'mongoose';
import { ExpeditionDocument } from 'src/types/expeditionDocument.type';
import { CreateExpeditionDto } from './dto/createExpedition.dto';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
    ) {}

    async createExpedition(data: CreateExpeditionDto): Promise<Expedition> {
        const expedition = new this.expedition(data);
        return expedition.save();
    }

    async playerHasAnExpedition(
        player_id: string,
        status: ExpeditionStatusEnum,
    ): Promise<boolean> {
        const itemExists = await this.expedition
            .findOne({ player_id, status })
            .select('_id')
            .lean();
        return itemExists === null ? false : true;
    }

    composeErrorMessage(message: string, statusCode: HttpStatus): void {
        throw new HttpException(
            {
                data: {
                    message,
                    status: statusCode,
                },
            },
            statusCode,
        );
    }
}
