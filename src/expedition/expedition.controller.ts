import {
    Controller,
    Get,
    Headers,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
        } catch (e) {}
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
            const { id: player_id } = data.data;

            const expeditionExists =
                await this.expeditionService.playerHasAnExpedition(
                    player_id,
                    ExpeditionStatusEnum.InProgress,
                );

            if (!expeditionExists) {
            } else {
                return response
                    .status(HttpStatus.CREATED)
                    .send({ data: { expeditionCreated: false } });
            }

            return response
                .status(HttpStatus.CREATED)
                .send({ data: { expeditionCreated: true } });
        } catch (e) {}
    }
    //#endregion creates a new expedition in Draft status
}
