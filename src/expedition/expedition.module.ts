import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { CardService } from 'src/card/card.service';
import { CharacterService } from 'src/character/character.service';
import { PrismaService } from 'src/prisma.service';
import { ExpeditionController } from './expedition.controller';
import { Expedition, ExpeditionSchema } from './expedition.schema';
import { ExpeditionService } from './expedition.service';

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
    controllers: [ExpeditionController],
    providers: [
        PrismaService,
        AuthGatewayService,
        CharacterService,
        ExpeditionService,
        CardService,
    ],
})
export class ExpeditionModule {}
