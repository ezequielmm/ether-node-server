import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocketGateway } from './socket.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketClientService } from 'src/socketClient/socketClient.service';
import { Expedition, ExpeditionSchema } from 'src/expedition/expedition.schema';
import {
    SocketClient,
    SocketClientSchema,
} from 'src/socketClient/socketClient.schema';
import { SocketService } from './socket.service';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { ExpeditionService } from 'src/expedition/expedition.service';
import { CardService } from 'src/card/card.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            {
                name: Expedition.name,
                schema: ExpeditionSchema,
            },
            {
                name: SocketClient.name,
                schema: SocketClientSchema,
            },
        ]),
    ],
    providers: [
        PrismaService,
        SocketGateway,
        SocketService,
        AuthGatewayService,
        SocketClientService,
        ExpeditionService,
        CardService,
    ],
})
export class SocketModule {}
