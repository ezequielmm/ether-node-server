import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TrinketController } from './trinket.controller';
import { TrinketService } from './trinket.service';

@Module({
    controllers: [TrinketController],
    providers: [PrismaService, TrinketService],
})
export class TrinketModule {}
