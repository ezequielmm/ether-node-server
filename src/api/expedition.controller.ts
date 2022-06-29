import {
    Controller,
    Get,
    Logger,
    UseGuards,
    Headers,
    HttpException,
    HttpStatus,
    Res,
    Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { ExpeditionService } from '../game/components/expedition/expedition.service';
import { CardService } from '../game/components/card/card.service';
import { CharacterService } from '../game/components/character/character.service';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import {
    IExpeditionCancelledResponse,
    IExpeditionCreatedResponse,
    IExpeditionStatusResponse,
} from 'src/game/components/expedition/expedition.interface';
import { CharacterClassEnum } from 'src/game/components/character/character.enum';
import { ExpeditionStatusEnum } from 'src/game/components/expedition/expedition.enum';

@ApiBearerAuth()
@ApiTags('Expedition')
@Controller('expeditions')
@UseGuards(new AuthGuard())
export class ExpeditionController {
    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly characterService: CharacterService,
    ) {}

    private readonly logger: Logger = new Logger(ExpeditionController.name);

    @ApiOperation({
        summary: 'Check if the given user has an expedition in progress or not',
    })
    @Get('/status')
    async handleGetExpeditionStatus(
        @Headers() headers,
    ): Promise<IExpeditionStatusResponse> {
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
        @Res() response,
    ): Promise<IExpeditionCreatedResponse> {
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
                const cards = await this.cardService.findAll();

                const character = await this.characterService.findOne({
                    characterClass: CharacterClassEnum.Knight,
                });

                const map = this.expeditionService.getMap();

                await this.expeditionService.create({
                    playerId,
                    map,
                    playerState: {
                        playerName,
                        characterClass: character.characterClass,
                        hpMax: character.initialHealth,
                        hpCurrent: character.initialHealth,
                        gold: character.initialGold,
                        cards: cards.map((card) => ({
                            cardId: card.cardId,
                            id: card._id.toString(),
                            name: card.name,
                            description: card.description,
                            rarity: card.rarity,
                            energy: card.energy,
                            cardType: card.cardType,
                            pool: card.pool,
                            properties: card.properties,
                            keywords: card.keywords,
                            isTemporary: false,
                        })),
                        createdAt: new Date(),
                    },
                    status: ExpeditionStatusEnum.InProgress,
                });

                return response
                    .status(HttpStatus.CREATED)
                    .send({ data: { expeditionCreated: true } });
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
        @Res() response,
    ): Promise<IExpeditionCancelledResponse> {
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

                return response
                    .status(HttpStatus.OK)
                    .send({ data: { expeditionCancelled: true } });
            } else {
                return response.status(HttpStatus.OK).send({
                    data: {
                        message: 'Player has no expedition in progress',
                    },
                });
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
