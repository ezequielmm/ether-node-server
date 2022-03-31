import { Body, Controller, Post, Version } from '@nestjs/common';
import { GetExpeditionStatus } from './dto/getExpeditionStatus.dto';
import { ExpeditionService } from './expedition.service';

@Controller('expeditions')
export class ExpeditionController {
    constructor(private readonly service: ExpeditionService) {}

    @Version('1')
    @Post('/status')
    async getExpeditionStatus(
        @Body() data: GetExpeditionStatus,
    ): Promise<{ hasExpedition: boolean }> {
        const { player_id } = data;
        const hasExpedition: boolean = await this.service.playerHasAnExpedition(
            player_id,
        );
        return { hasExpedition };
    }
}
