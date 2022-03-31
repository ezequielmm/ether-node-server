import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { PlayerService } from './player.service';

@Module({
    imports: [PrismaModule],
    controllers: [],
    providers: [PlayerService],
})
export class PlayerModule {}
