import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { ExpeditionService } from 'src/expedition/expedition.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Expedition, ExpeditionSchema } from 'src/expedition/expedition.schema';

@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            {
                name: Expedition.name,
                schema: ExpeditionSchema,
            },
        ]),
    ],
    providers: [ExpeditionService, SocketGateway, SocketService],
})
export class SocketModule {}
