import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocketGateway } from './socket.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Expedition, ExpeditionSchema } from 'src/expedition/expedition.schema';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { CardService } from 'src/card/card.service';
import { PrismaService } from 'src/prisma.service';
import { ExpeditionService } from 'src/expedition/expedition.service';
import { SocketService } from './socket.service';

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
        AuthGatewayService,
        ExpeditionService,
        CardService,
        SocketService,
    ],
})
export class SocketModule {}
