import {
    Controller,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { ExpeditionService } from '../game/expedition/expedition.service';
import { CardService } from '../game/components/card/card.service';
import { CharacterService } from '../game/components/character/character.service';
import { CharacterClassEnum } from '../game/components/character/enums';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';

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

    //#region Get Expedition status by player id
    @ApiOperation({
        summary: 'Get if the user has an expedition in progress or not',
    })
    @Get('/status')
    async handleGetExpeditionsStatus(
        @Headers() headers,
    ): Promise<{ hasExpedition: boolean }> {
        const { authorization } = headers;

        try {
            const {
                data: {
                    data: { id: player_id },
                },
            } = await this.authGatewayService.getUser(authorization);

            const hasExpedition =
                await this.expeditionService.playerHasExpeditionInProgress(
                    player_id,
                );

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
    //#endregion

    //#region Creates a new expedition
    @ApiOperation({
        summary: `Creates a new expedition for the player`,
    })
    @Post()
    async handleCreateExpedition(
        @Headers() headers,
        @Res() response,
    ): Promise<{ createdExpedition: boolean }> {
        const { authorization } = headers;

        try {
            const {
                data: {
                    data: { id: player_id, name: player_name },
                },
            } = await this.authGatewayService.getUser(authorization);

            const hasExpedition =
                await this.expeditionService.playerHasExpeditionInProgress(
                    player_id,
                );

            if (!hasExpedition) {
                const cards = await this.cardService.findAll();

                const character = await this.characterService.findOne({
                    character_class: CharacterClassEnum.Knight,
                });

                const map = this.expeditionService.getMap();

                await this.expeditionService.create({
                    player_id,
                    map,
                    player_state: {
                        player_name,
                        character_class: character.character_class,
                        hp_max: character.initial_health,
                        hp_current: character.initial_health,
                        gold: character.initial_gold,
                        potions: {
                            1: null,
                            2: null,
                            3: null,
                        },
                        deck: {
                            cards: cards.map((card) => ({
                                id: card._id.toString(),
                                name: card.name,
                                description: card.description,
                                rarity: card.rarity,
                                energy: card.energy,
                                card_type: card.card_type,
                                pool: card.pool,
                                targeted: card.targeted,
                                properties: card.properties,
                                keywords: card.keywords,
                                is_temporary: false,
                            })),
                        },
                        created_at: new Date(),
                    },
                });

                return response
                    .status(HttpStatus.CREATED)
                    .send({ data: { expeditionCreated: true } });
            } else {
                return response.status(HttpStatus.CREATED).send({
                    data: {
                        message: 'Player has an expedition in progress',
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
    //#endregion

    // #region Cancel expedition
    @ApiOperation({
        summary: `Cancel the expedition`,
    })
    @Post('/cancel')
    async handleCancelExpedition(
        @Headers() headers,
        @Res() response,
    ): Promise<{ canceledExpedition: boolean }> {
        const { authorization } = headers;

        try {
            const {
                data: {
                    data: { id: player_id },
                },
            } = await this.authGatewayService.getUser(authorization);

            const hasExpedition =
                await this.expeditionService.playerHasExpeditionInProgress(
                    player_id,
                );

            if (hasExpedition) {
                await this.expeditionService.cancel(player_id);

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
    // #endregion
}
