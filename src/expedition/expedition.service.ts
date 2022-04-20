import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expedition } from './expedition.schema';
import { Model } from 'mongoose';
import { ExpeditionDocument } from 'src/types/expeditionDocument.type';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { CreateExpeditionDTO } from './dto/createExpedition.dto';

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

    async playerHasAnExpedition(
        player_id: string,
        status: ExpeditionStatusEnum,
    ): Promise<boolean> {
        const itemExists = await this.expedition.exists({ player_id, status });
        return itemExists !== null;
    }

    throwError(message: string, statusCode: HttpStatus): void {
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
