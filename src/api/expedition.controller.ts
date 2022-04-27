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
import { AuthGuard } from '../guards/auth.guard';
import { AuthGatewayService } from '../authGateway/authGateway.service.';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { CardService } from '../components/card/card.service';
import { CharacterService } from '../components/character/character.service';
import { CharacterClassEnum } from '../components/character/enums';

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
            } else {
                return response.status(HttpStatus.CREATED).send({
                    data: {
                        message: 'Player has an expedition in progress',
                    },
                });
            }
        } catch (e) {
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
}
