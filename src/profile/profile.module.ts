import { Module } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import { PrismaModule } from 'src/prisma.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [PrismaModule],
    controllers: [ProfileController],
    providers: [ProfileService, PlayerService],
})
export class ProfileModule {}
