import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocketGateway } from './socket.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Expedition, ExpeditionSchema } from 'src/expedition/expedition.schema';
import { SocketService } from './socket.service';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { CardService } from 'src/card/card.service';
import { PrismaService } from 'src/prisma.service';
import { ExpeditionService } from 'src/expedition/expedition.service';

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
    providers: [
        PrismaService,
        SocketGateway,
        SocketService,
        AuthGatewayService,
        ExpeditionService,
        CardService,
    ],
})
export class SocketModule {}
