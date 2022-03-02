import { Body, Controller, Get, Version } from '@nestjs/common';
import { Room } from '@prisma/client';
import { FilterRoomsDto } from './dto/FilterRoomsDto.dto';
import { RoomService } from './room.service';

@Controller()
export class RoomController {
    constructor(private readonly service: RoomService) {}

    @Version('1')
    @Get('/combats/start')
    async getRoomsByPlayerId_V1(@Body() data: FilterRoomsDto): Promise<Room[]> {
        const { player_id } = data;
        return await this.service.getRoomByPlayerId_V1({ player_id });
    }
}
