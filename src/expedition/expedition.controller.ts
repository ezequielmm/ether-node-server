import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Version,
} from '@nestjs/common';
import { CancelExpeditionDto } from './dto/cancelExpedition.dto';
import { GetExpeditionStatus } from './dto/getExpeditionStatus.dto';
import { Expedition } from './expedition.schema';
import { ExpeditionService } from './expedition.service';

@Controller('expeditions')
export class ExpeditionController {
    constructor(private readonly service: ExpeditionService) {}

    @Version('1')
    @Get('/status')
    async getExpeditionStatus(
        @Body() data: GetExpeditionStatus,
    ): Promise<{ hasExpedition: boolean }> {
        const { player_id } = data;
        const hasExpedition: boolean = await this.service.playerHasAnExpedition(
            player_id,
        );
        return { hasExpedition };
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
