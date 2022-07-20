import {
    Controller,
    Get,
    Logger,
    UseGuards,
    Headers,
    HttpException,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { ExpeditionService } from '../game/components/expedition/expedition.service';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import {
    IExpeditionCancelledResponse,
    IExpeditionCreatedResponse,
    IExpeditionStatusResponse,
} from 'src/game/components/expedition/expedition.interface';
import { ExpeditionStatusEnum } from 'src/game/components/expedition/expedition.enum';
import { InitExpeditionProcess } from 'src/game/process/initExpedition.process';

@ApiBearerAuth()
@ApiTags('Expedition')
@Controller('expeditions')
@UseGuards(new AuthGuard())
export class ExpeditionController {
    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly expeditionService: ExpeditionService,
        private readonly initExpeditionProcess: InitExpeditionProcess,
    ) {}

    private readonly logger: Logger = new Logger(ExpeditionController.name);

    @ApiOperation({
        summary: 'Check if the given user has an expedition in progress or not',
    })
    @Get('/status')
    async handleGetExpeditionStatus(
        @Headers() headers,
    ): Promise<IExpeditionStatusResponse> {
        this.logger.log(`Client called GET route "/expeditions/status"`);

        const { authorization } = headers;

        try {
            const {
                data: {
                    data: { id: playerId },
                },
            } = await this.authGatewayService.getUser(authorization);

            const hasExpedition =
                await this.expeditionService.playerHasExpeditionInProgress({
                    clientId: playerId,
                });

            return { hasExpedition };
        } catch (e) {
            this.logger.error(e.stack);
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: e.message,
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    @ApiOperation({
        summary: `Creates a new expedition for the player`,
    })
    @Post()
    async handleCreateExpedition(
        @Headers() headers,
    ): Promise<IExpeditionCreatedResponse> {
        this.logger.log(`Client called POST route "/expeditions"`);

        const { authorization } = headers;

        try {
            const {
                data: {
                    data: { id: playerId, name: playerName },
                },
            } = await this.authGatewayService.getUser(authorization);

            const hasExpedition =
                await this.expeditionService.playerHasExpeditionInProgress({
                    clientId: playerId,
                });

            if (!hasExpedition) {
                await this.initExpeditionProcess.handle({
                    playerId,
                    playerName,
                });

                return { expeditionCreated: true };
            } else {
                return { expeditionCreated: true };
            }
        } catch (e) {
            this.logger.error(e.stack);
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: e.message,
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    @ApiOperation({
        summary: `Cancel the expedition`,
    })
    @Post('/cancel')
    async handleCancelExpedition(
        @Headers() headers,
    ): Promise<IExpeditionCancelledResponse> {
        this.logger.log(`Client called POST route "/expedition/cancel"`);

        const { authorization } = headers;

        try {
            const {
                data: {
                    data: { id: playerId },
                },
            } = await this.authGatewayService.getUser(authorization);

            const hasExpedition =
                await this.expeditionService.playerHasExpeditionInProgress({
                    clientId: playerId,
                });

            if (hasExpedition) {
                await this.expeditionService.update(playerId, {
                    status: ExpeditionStatusEnum.Canceled,
                });

                return { canceledExpedition: true };
            } else {
                return { canceledExpedition: false };
            }
        } catch (e) {
            this.logger.error(e.stack);
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: e.message,
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
}
