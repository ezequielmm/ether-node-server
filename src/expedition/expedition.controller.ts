import {
    Controller,
    Get,
    Headers,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'prisma/data/map';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { CharacterService } from 'src/character/character.service';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { ExpeditionCreatedInterface } from 'src/interfaces/expeditionCreated.interface';
import { ExpeditionStatusInterface } from 'src/interfaces/expeditionStatus.interface';
import { HeadersData } from 'src/interfaces/headersData.interface';
import { Expedition } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { v4 as uuidv4 } from 'uuid';

@ApiBearerAuth()
@ApiTags('Expeditions')
@Controller('expeditions')
export class ExpeditionController {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly authGatewayService: AuthGatewayService,
        private readonly characterService: CharacterService,
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

    //#region creates a new expedition in Draft status
    @ApiOperation({
        summary: `Creates a new expedition with status 'draft'`,
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

            if (
                !(await this.expeditionService.playerHasAnExpedition(
                    player_id,
                    ExpeditionStatusEnum.Draft,
                ))
            ) {
                const character =
                    await this.characterService.getCharacterByClass();

                const expedition: Expedition = {
                    player_id,
                    _id: uuidv4(),
                    deck: {},
                    map,
                    player_state: {
                        className: character.character_class,
                        hp_max: character.initial_health,
                        hp_current: character.initial_health,
                        gold: character.initial_gold,
                        potions: {
                            1: null,
                            2: null,
                            3: null,
                        },
                        trinkets: [],
                        deck: [],
                        private_data: {},
                    },
                    current_state: {},
                    status: ExpeditionStatusEnum.Draft,
                };

                await this.expeditionService.createExpedition(expedition);
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
