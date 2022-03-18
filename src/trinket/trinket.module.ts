import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { TrinketController } from './trinket.controller';
import { TrinketService } from './trinket.service';

@Module({
    imports: [PrismaModule],
    controllers: [TrinketController],
    providers: [TrinketService],
})
export class TrinketModule {}
