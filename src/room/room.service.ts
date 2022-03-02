import { Injectable } from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoomService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get all the enemies
     * @version 1
     */
    async getRoomByPlayerId_V1(where: Prisma.RoomWhereInput): Promise<Room[]> {
        return await this.prisma.room.findMany({ where });
    }
}
