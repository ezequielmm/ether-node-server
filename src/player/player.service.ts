import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlayerService {
    constructor(private prisma: PrismaService) {}
    async getPlayer(id: string): Promise<Player | null> {
        const player = await this.prisma.player.findUnique({
            where: { id },
        });
        return player;
    }
}
