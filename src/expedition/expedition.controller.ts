import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Version,
} from '@nestjs/common';
import { CreateExpeditionDto } from './dto/createExpedition.dto';
import { Expedition } from './expedition.schema';
import { ExpeditionService } from './expedition.service';

@Controller('expeditions')
export class ExpeditionController {
    constructor(private readonly service: ExpeditionService) {}

    @Version('1')
    @Post()
    async createExpedition_V1(
        @Body() data: CreateExpeditionDto,
    ): Promise<Expedition> {
        return await this.service.createExpedition_V1(data);
    }

    @Version('1')
    @Get(':id')
    async getExpeditionsByPlayerId_V1(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Expedition[]> {
        return await this.service.getExpeditionById_V1(id);
    }
}
