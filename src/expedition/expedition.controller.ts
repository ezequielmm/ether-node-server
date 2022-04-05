import {
    Controller,
    Get,
    Version,
    Headers,
    HttpException,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CharacterService } from 'src/character/character.service';
import { ExpeditionStatusInterface } from 'src/interfaces/ExpeditionStatus.interface';
import { HeadersData } from 'src/interfaces/HeadersData.interface';
import { SocketService } from 'src/socket/socket.service';
import { Expedition, ExpeditionStatus } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { v4 as uuidv4 } from 'uuid';
import { map } from './mapGenerator';

@ApiBearerAuth()
@ApiTags('Expeditions')
@Controller('expeditions')
export class ExpeditionController {
    constructor(
        private readonly service: ExpeditionService,
        private readonly socketService: SocketService,
        private readonly characterService: CharacterService,
    ) {}

    @Version('1')
    @Get('/status')
    @ApiOperation({
        summary: 'Get if the user has an expedition in progress or not',
    })
    async getExpeditionStatus(
        @Headers() headers: HeadersData,
    ): Promise<ExpeditionStatusInterface> {
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

    @ApiOperation({
        summary: `Creates a new expedition with status 'draft'`,
    })
    @Version('1')
    @Post('/')
    async createExpedition(
        @Headers() headers: HeadersData,
        @Res() response,
    ): Promise<{ expeditionCreated: boolean }> {
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

            if (!(await this.service.playerHasAPendingExpedition(player_id))) {
                const character =
                    await this.characterService.getCharacterByClass();

                const expedition: Expedition = {
                    player_id,
                    _id: uuidv4(),
                    deck: {},
                    map,
                    player_state: {
                        className: character.class,
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
                        private: {},
                    },
                    current_state: {},
                    status: ExpeditionStatus.Draft,
                };

                await this.service.createExpedition_V1(expedition);
            }

            return response
                .status(HttpStatus.CREATED)
                .send({ expeditionCreated: true });
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
}
