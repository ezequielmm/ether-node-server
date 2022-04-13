import {
    Controller,
    Get,
    Headers,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardClassEnum } from '@prisma/client';
import { map } from 'prisma/data/map';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { CardService } from 'src/card/card.service';
import { CharacterService } from 'src/character/character.service';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { ExpeditionCreatedInterface } from 'src/interfaces/expeditionCreated.interface';
import { ExpeditionStatusInterface } from 'src/interfaces/expeditionStatus.interface';
import { HeadersData } from 'src/interfaces/headersData.interface';
import { ExpeditionService } from './expedition.service';

@ApiBearerAuth()
@ApiTags('Expeditions')
@Controller('expeditions')
export class ExpeditionController {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly authGatewayService: AuthGatewayService,
        private readonly characterService: CharacterService,
        private readonly cardService: CardService,
    ) {}

    //#region Get Expedition status by player id
    @ApiOperation({
        summary: 'Get if the user has an expedition in progress or not',
    })
    @Get('/status')
    async handleGetExpeditionStatus(
        @Headers() headers: HeadersData,
    ): Promise<ExpeditionStatusInterface> {
        let authorization = headers.authorization;

        if (!authorization)
            this.expeditionService.composeErrorMessage(
                'Invalid Token',
                HttpStatus.UNAUTHORIZED,
            );

        authorization = authorization.startsWith('Bearer')
            ? authorization.replace('Bearer', '').trim()
            : authorization;

        if (!authorization)
            this.expeditionService.composeErrorMessage(
                'Invalid Token',
                HttpStatus.UNAUTHORIZED,
            );

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
            this.expeditionService.composeErrorMessage(
                e.message,
                HttpStatus.UNAUTHORIZED,
            );
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
        let authorization = headers.authorization;

        if (!authorization)
            this.expeditionService.composeErrorMessage(
                'Invalid Token',
                HttpStatus.UNAUTHORIZED,
            );

        authorization = authorization.startsWith('Bearer')
            ? authorization.replace('Bearer', '').trim()
            : authorization;

        if (!authorization)
            this.expeditionService.composeErrorMessage(
                'Invalid Token',
                HttpStatus.UNAUTHORIZED,
            );

        try {
            const { data } = await this.authGatewayService.getUser(
                authorization,
            );
            const { id: player_id } = data.data;

            const expeditionExists =
                await this.expeditionService.playerHasAnExpedition(
                    player_id,
                    ExpeditionStatusEnum.InProgress,
                );

            if (!expeditionExists) {
                const character =
                    await this.characterService.getCharacterByClass();

                const cards = await this.cardService.getCards({
                    card_class: CardClassEnum.knight,
                });

                await this.expeditionService.createExpedition({
                    player_id,
                    map,
                    player_state: {
                        character_class: character.character_class,
                        hp_max: character.initial_health,
                        hp_current: character.initial_health,
                        gold: character.initial_gold,
                        trinkets: [],
                        potions: {
                            1: null,
                            2: null,
                            3: null,
                        },
                        deck: {
                            cards: cards.map((card) => ({
                                name: card.name,
                                id: card.id,
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
            } else {
                return response
                    .status(HttpStatus.CREATED)
                    .send({ data: { expeditionCreated: false } });
            }

            return response
                .status(HttpStatus.CREATED)
                .send({ data: { expeditionCreated: true } });
        } catch (e) {
            this.expeditionService.composeErrorMessage(
                e.message,
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }
    }
    //#endregion creates a new expedition in Draft status
}
