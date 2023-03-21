import {
    Controller,
    Get,
    Logger,
    UseGuards,
    Headers,
    HttpException,
    HttpStatus,
    Post,
    Body,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiProperty,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { ExpeditionService } from '../game/components/expedition/expedition.service';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { ExpeditionStatusEnum } from 'src/game/components/expedition/expedition.enum';
import { InitExpeditionProcess } from 'src/game/process/initExpedition.process';
import {
    ScoreCalculatorService,
    ScoreResponse,
} from 'src/game/scoreCalculator/scoreCalculator.service';
import { GearItem } from '../playerGear/gearItem';
import { PlayerGearService } from '../playerGear/playerGear.service';

class CreateExpeditionApiDTO {
    @ApiProperty({ default: 'Knight' })
    readonly tokenType: string;

    @ApiProperty()
    readonly nftId: number;

    @ApiProperty()
    readonly equippedGear: GearItem[];
}

@ApiBearerAuth()
@ApiTags('Expedition')
@Controller('expeditions')
@UseGuards(new AuthGuard())
export class ExpeditionController {
    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly expeditionService: ExpeditionService,
        private readonly initExpeditionProcess: InitExpeditionProcess,
        private readonly scoreCalculatorService: ScoreCalculatorService,
        private readonly playerGearService: PlayerGearService,
    ) {}

    private readonly logger: Logger = new Logger(ExpeditionController.name);

    @ApiOperation({
        summary: 'Check if the given user has an expedition in progress or not',
    })
    @Get('/status')
    async handleGetExpeditionStatus(@Headers() headers): Promise<{
        hasExpedition: boolean;
        nftId: number;
        tokenType: string;
        equippedGear: GearItem[];
    }> {
        this.logger.log(`Client called GET route "/expeditions/status"`);

        const { authorization } = headers;

        //todo add class knight, villager, blessedvillager

        try {
            const { id: playerId } = await this.authGatewayService.getUser(
                authorization,
            );

            const expedition = await this.expeditionService.findOne(
                {
                    playerId: playerId,
                    status: ExpeditionStatusEnum.InProgress,
                },
                { playerState: 1, isCurrentlyPlaying: 1 },
            );

            const hasExpedition =
                expedition !== null && !expedition.isCurrentlyPlaying;
            const nftId = expedition?.playerState?.nftId ?? -1;
            const equippedGear = expedition?.playerState?.equippedGear ?? [];
            const tokenType =
                expedition?.playerState?.characterClass ?? 'missing';
            //todo parse for front end

            return { hasExpedition, nftId, tokenType, equippedGear };
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
        @Body() payload: CreateExpeditionApiDTO,
    ): Promise<{
        expeditionCreated: boolean;
        reason?: string;
    }> {
        this.logger.log(`Client called POST route "/expeditions"`);

        const { authorization } = headers;

        try {
            const {
                id: playerId,
                name: playerName,
                email,
            } = await this.authGatewayService.getUser(authorization);

            const { nftId } = payload;
            const { equippedGear } = payload;
            const character_class = payload.tokenType;

            if (equippedGear?.length === 0) {
                // validate equippedGear vs ownedGeared
                const all_are_owned = await this.playerGearService.allAreOwned(
                    playerId,
                    equippedGear,
                );
                if (!all_are_owned) {
                    return { expeditionCreated: false, reason: 'wrong gear' };
                }
            }

            const hasExpedition =
                await this.expeditionService.playerHasExpeditionInProgress({
                    clientId: playerId,
                });

            if (!hasExpedition) {
                await this.initExpeditionProcess.handle({
                    playerId,
                    playerName,
                    email,
                    nftId,
                    equippedGear,
                    character_class,
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
    async handleCancelExpedition(@Headers() headers): Promise<{
        canceledExpedition: boolean;
    }> {
        this.logger.log(`Client called POST route "/expedition/cancel"`);

        const { authorization } = headers;

        try {
            const { id: playerId } = await this.authGatewayService.getUser(
                authorization,
            );

            const hasExpedition =
                await this.expeditionService.playerHasExpeditionInProgress({
                    clientId: playerId,
                });

            if (hasExpedition) {
                await this.expeditionService.update(playerId, {
                    status: ExpeditionStatusEnum.Canceled,
                    isCurrentlyPlaying: false,
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

    @ApiOperation({
        summary: 'Query the expedition score',
    })
    @Get('/score')
    async handleGetScore(@Headers() headers): Promise<ScoreResponse> {
        this.logger.log(`Client called GET route "/expedition/score"`);

        const { authorization } = headers;

        try {
            const { id: playerId } = await this.authGatewayService.getUser(
                authorization,
            );

            const expedition = await this.expeditionService.findOneTimeDesc({
                playerId,
                $or: [
                    { status: ExpeditionStatusEnum.Victory },
                    { status: ExpeditionStatusEnum.Defeated },
                ],
            });

            if (!expedition) return null;

            return expedition.finalScore;
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
