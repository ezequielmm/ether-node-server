import {
    Body,
    Controller,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Version,
} from '@nestjs/common';
import { CancelExpeditionDto } from './dto/cancelExpedition.dto';
import { CreateExpeditionDto } from './dto/createExpedition.dto';
import { Expedition } from './expedition.schema';
import { ExpeditionService } from './expedition.service';

@Controller('expeditions')
export class ExpeditionController {
    constructor(private readonly service: ExpeditionService) {}

    @Version('1')
    @Post('/')
    async createExpedition_V1(
        @Body() data: CreateExpeditionDto,
    ): Promise<Expedition> {
        return await this.service.createExpedition_V1(data);
    }

    @Version('1')
    @Patch('/cancel/:id')
    async cancelExpedition_V1(
        @Body() data: CancelExpeditionDto,
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Expedition> {
        return await this.service.cancelExpedition_V1(id, data.player_id);
    }
}
