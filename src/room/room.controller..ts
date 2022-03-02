import { Body, Controller, Post, Version } from '@nestjs/common';
import { Room } from '@prisma/client';
import { FilterRoomsDto } from './dto/FilterRoomsDto.dto';
import { RoomService } from './room.service';

@Controller()
export class RoomController {
    constructor(private readonly service: RoomService) {}

    @Version('1')
    @Post('/combats/start')
    async getRoomsByPlayerId_V1(@Body() data: FilterRoomsDto): Promise<Room[]> {
        return await this.service.getRoomByPlayerId_V1(data);
    }
}
