import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { FilterRoomsDto } from './dto/FilterRoomsDto.dto';

@Injectable()
export class RoomService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get all the enemies
     * @version 1
     */
    async getRoomByPlayerId_V1({ player_id }: FilterRoomsDto): Promise<Room[]> {
        return await this.prisma.room.findMany({ where: { player_id } });
    }
}
