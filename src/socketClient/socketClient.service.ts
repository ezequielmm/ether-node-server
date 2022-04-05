import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatSocketClientDto } from './dto/createSocketclient.dto';
import { SocketClient, SocketClientDocument } from './socketClient.schema';

@Injectable()
export class SocketClientService {
    constructor(
        @InjectModel(SocketClient.name)
        private readonly model: Model<SocketClientDocument>,
    ) {}

    async create(payload: CreatSocketClientDto): Promise<SocketClient> {
        const createdSocketClient = new this.model(payload);
        return createdSocketClient.save();
    }

    async getByClientId(client_id: string): Promise<{ player_id: string }> {
        return await this.model
            .findOne({ client_id })
            .select('player_id')
            .lean();
    }

    async delete(client_id: string): Promise<void> {
        return await this.model.findOneAndDelete({ client_id });
    }
}
