import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Version,
    Headers,
    Logger,
    Res,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ExpeditionStatus } from 'src/interfaces/ExpeditionStatus.interface';
import { HeadersData } from 'src/interfaces/HeadersData.interface';
import { SocketService } from 'src/socket/socket.service';
import { CancelExpeditionDto } from './dto/cancelExpedition.dto';
import { Expedition } from './expedition.schema';
import { ExpeditionService } from './expedition.service';

@ApiBearerAuth()
@ApiTags('Expeditions')
@Controller('expeditions')
export class ExpeditionController {
    private readonly logger: Logger = new Logger(ExpeditionController.name);

    constructor(
        private readonly service: ExpeditionService,
        private readonly socketService: SocketService,
    ) {}

    @Version('1')
    @Get('/status')
    @ApiOperation({
        summary: 'Get if the user has an expedition in progress or not',
    })
    @ApiResponse({
        status: 200,
    })
    @ApiResponse({
        status: 422,
    })
    async getExpeditionStatus(
        @Headers() headers: HeadersData,
        @Res() response,
    ): Promise<ExpeditionStatus> {
        const { authorization } = headers;

        try {
            const { data } = await this.socketService.getUser(authorization);
            const { id: player_id } = data.data;
            const hasExpedition: boolean =
                await this.service.playerHasAnExpedition(player_id);
            return { hasExpedition, message: '' };
        } catch (e) {
            this.logger.log(e.message);
            return response
                .status(HttpStatus.UNAUTHORIZED)
                .send({ hasExpedition: false, message: e.message });
        }
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
