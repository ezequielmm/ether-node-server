import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SocketClient } from './socketClient.schema';
import { Model } from 'mongoose';
import { SocketClientDocument } from 'src/types/socketDocument.type';
import { CreateSocketClientDto } from './dto/createSocketClient.dto';
import { SocketClientPlayerIdInterface } from 'src/interfaces/socketClientPlayerId.interface';

@Injectable()
export class SocketClientService {
    constructor(
        @InjectModel(SocketClient.name)
        private readonly socketClient: Model<SocketClientDocument>,
    ) {}

    async create(payload: CreateSocketClientDto): Promise<SocketClient> {
        const createdSocketClient = new this.socketClient(payload);
        return await createdSocketClient.save();
    }

    async clearClients(): Promise<void> {
        await this.socketClient.deleteMany({});
    }

    async getSocketClientPlayerIdByClientId(
        client_id: string,
    ): Promise<SocketClientPlayerIdInterface> {
        return await this.socketClient
            .findOne({ client_id })
            .select('player_id')
            .lean();
    }

    async delete(client_id: string): Promise<void> {
        return await this.socketClient.findOneAndDelete({ client_id });
    }
}
