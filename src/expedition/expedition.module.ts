import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from 'src/prisma.module';
import { ExpeditionController } from './expedition.controller';
import { Expedition, ExpeditionSchema } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { CharacterService } from '../character/character.service';
import { ExpeditionGateway } from './expedition.gateway';

@Module({
    imports: [
        PrismaModule,
        MongooseModule.forFeature([
            {
                name: Expedition.name,
                schema: ExpeditionSchema,
            },
        ]),
    ],
    controllers: [ExpeditionController],
    providers: [ExpeditionService, ExpeditionGateway, CharacterService],
})
export class ExpeditionModule {}
