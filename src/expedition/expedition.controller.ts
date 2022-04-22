import {
    Controller,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardClassEnum } from '@prisma/client';
import { map } from 'prisma/data/map';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { CardService } from 'src/card/card.service';
import { CharacterService } from 'src/character/character.service';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { ExpeditionCreatedInterface } from 'src/interfaces/expeditionCreated.interface';
import { ExpeditionStatusInterface } from 'src/interfaces/expeditionStatus.interface';
import { HeadersData } from 'src/interfaces/headersData.interface';
import { ExpeditionService } from './expedition.service';

@ApiBearerAuth()
@ApiTags('Expeditions')
@Controller('expeditions')
@UseGuards(new AuthGuard())
export class ExpeditionController {
    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly characterService: CharacterService,
        private readonly cardService: CardService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    //#region Get Expedition status by player id
    @ApiOperation({
        summary: 'Get if the user has an expedition in progress or not',
    })
    @Get('/status')
    async handleGetExpeditionStatus(
        @Headers() headers: HeadersData,
    ): Promise<ExpeditionStatusInterface> {
        const { authorization } = headers;

        try {
            const { data } = await this.authGatewayService.getUser(
                authorization,
            );
            const { id: player_id } = data.data;
            const hasExpedition: boolean =
                await this.expeditionService.playerHasAnExpedition(
                    player_id,
                    ExpeditionStatusEnum.InProgress,
                );
            return { hasExpedition };
        } catch (e) {
            this.throwError(e.message, HttpStatus.UNAUTHORIZED);
        }
    }
    //#endregion Get Expedition status by player id

    //#region creates a new expedition
    @ApiOperation({
        summary: `Creates a new expedition for the player`,
    })
    @Post()
    async handleCreateExpedition(
        @Headers() headers: HeadersData,
        @Res() response,
    ): Promise<ExpeditionCreatedInterface> {
        const { authorization } = headers;

        try {
            const { data } = await this.authGatewayService.getUser(
                authorization,
            );
            const { id: player_id, name: player_name } = data.data;

            const expeditionExists =
                await this.expeditionService.playerHasAnExpedition(
                    player_id,
                    ExpeditionStatusEnum.InProgress,
                );

            if (!expeditionExists) {
                const cards = await this.cardService.getCards({
                    card_class: CardClassEnum.knight,
                });

                const character =
                    await this.characterService.getCharacterByClass();

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
                                id: card.id,
                                name: card.name,
                                description: card.description,
                                rarity: card.rarity,
                                energy: card.energy,
                                type: card.type,
                                coin_min: card.coins_min,
                                coin_max: card.coins_max,
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
            this.throwError(e.message, HttpStatus.UNAUTHORIZED);
        }
    }
    //#endregion creates a new expedition in Draft status

    private throwError(message: string, statusCode: HttpStatus): void {
        throw new HttpException(
            {
                data: {
                    message,
                    status: statusCode,
                },
            },
            statusCode,
        );
    }
}
