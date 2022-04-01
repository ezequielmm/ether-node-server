import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExpeditionDto } from './dto/createExpedition.dto';
import {
    Expedition,
    ExpeditionDocument,
    ExpeditionStatus,
} from './expedition.schema';
import { v4 as uuidv4 } from 'uuid';
import { map } from './mapGenerator';
import { UpdateExpeditionStatus } from 'src/interfaces/UpdateExpeditionStatus.interface';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private model: Model<ExpeditionDocument>,
    ) {}

    async createExpedition_V1(
        expedition: CreateExpeditionDto,
    ): Promise<Expedition> {
        const { player_id, character_id } = expedition;

        if (await this.playerHasAnExpedition(player_id)) {
            return await this.getExpeditionByPlayerId(player_id);
        } else {
            const data: Expedition = {
                player_id,
                character_id,
                _id: uuidv4(),
                deck: [{ card_instances: null }],
                map: map,
                player_state: {},
                current_state: {},
                status: ExpeditionStatus.InProgress,
            };
            const newExpedition = new this.model(data);
            return newExpedition.save();
        }
    }

    async getExpeditionById(id: string): Promise<Expedition> {
        return await this.model.findById(id).select('-__v').exec();
    }

    async getExpeditionByPlayerId(player_id: string): Promise<Expedition> {
        return await this.model.findOne({ player_id }).select('-__v').exec();
    }

    async playerHasAnExpedition(player_id: string): Promise<boolean> {
        const itemExists = await this.model
            .findOne({ player_id, status: ExpeditionStatus.InProgress })
            .select('_id')
            .lean();
        return itemExists === null ? false : true;
    }

    async expeditionBelongsToPlayer(
        player_id: string,
        expedition_id: string,
    ): Promise<boolean> {
        const itemExists = await this.model
            .findOne({
                player_id,
                _id: expedition_id,
            })
            .select('_id')
            .lean();
        return itemExists === null ? false : true;
    }

    async cancelExpedition_V1(
        expedition_id: string,
        player_id: string,
    ): Promise<Expedition> {
        const expedition = await this.model.findById(expedition_id);
        if (!expedition) {
            throw new NotFoundException(
                `Expedition with id ${expedition_id} not found`,
            );
        }
        const isOwner = await this.expeditionBelongsToPlayer(
            player_id,
            expedition_id,
        );
        if (!isOwner) {
            throw new ForbiddenException(
                `Player with id ${player_id} is not the owner of expedition ${expedition_id}`,
            );
        }

        return await expedition.save();
    }

    async getExpeditionStatusByPlayedId(
        playerId: string,
    ): Promise<{ status: string }> {
        return await this.model
            .findOne({ player_id: playerId })
            .select('status')
            .lean();
    }

    async updateActiveExpeditionByPlayerId(
        player_id: string,
        payload: UpdateExpeditionStatus,
    ): Promise<Expedition> {
        return this.model.findOneAndUpdate(
            { player_id, status: ExpeditionStatus.InProgress },
            payload,
            { new: true },
        );
    }
}
