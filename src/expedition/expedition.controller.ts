import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Version,
    Headers,
    HttpException,
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
    ): Promise<ExpeditionStatus> {
        let authorization = headers.authorization;

        if (!authorization)
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);

        authorization = authorization.startsWith('Bearer')
            ? authorization.replace('Bearer', '').trim()
            : authorization;

        if (!authorization)
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);

        try {
            const { data } = await this.socketService.getUser(authorization);
            const { id: player_id } = data.data;
            const hasExpedition: boolean =
                await this.service.playerHasAnExpedition(player_id);
            return { hasExpedition };
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
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
