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
    Req,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiProperty,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ExpeditionService } from '../game/components/expedition/expedition.service';
import { ExpeditionStatusEnum } from 'src/game/components/expedition/expedition.enum';
import { InitExpeditionProcess } from 'src/game/process/initExpedition.process';
import {
    ScoreCalculatorService,
    ScoreResponse,
} from 'src/game/scoreCalculator/scoreCalculator.service';
import { GearItem } from '../playerGear/gearItem';
import { PlayerGearService } from '../playerGear/playerGear.service';
import { ContestService } from '../game/contest/contest.service';
import { Contest } from 'src/game/contest/contest.schema';
import { IPlayerToken } from 'src/game/components/expedition/expedition.schema';
import { PlayerWinService } from 'src/playerWin/playerWin.service';
import { AuthorizedRequest } from 'src/auth/auth.types';
import { TroveService } from 'src/trove/trove.service';

class CreateExpeditionApiDTO {
    @ApiProperty({ default: 'Knight' })
    readonly tokenType: string;

    @ApiProperty()
    readonly walletId: string;

    @ApiProperty()
    readonly contractId: string;

    @ApiProperty()
    readonly nftId: number;

    @ApiProperty()
    readonly equippedGear: GearItem[];
}

@ApiBearerAuth()
@ApiTags('Expedition')
@Controller('expeditions')
@UseGuards(AuthGuard)
export class ExpeditionController {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly initExpeditionProcess: InitExpeditionProcess,
        private readonly scoreCalculatorService: ScoreCalculatorService,
        private readonly playerGearService: PlayerGearService,
        private readonly playerWinService: PlayerWinService,
        private readonly troveService: TroveService,
        private contestService: ContestService,
    ) { }

    private readonly logger: Logger = new Logger(ExpeditionController.name);

    @ApiOperation({
        summary: 'Check if the given user has an expedition in progress or not',
    })
    @Get('/status')
    async handleGetExpeditionStatus(
        @Req() { userAddress }: AuthorizedRequest,
    ): Promise<{
        hasExpedition: boolean;
        contractId: string;
        nftId: number;
        tokenType: string;
        equippedGear: GearItem[];
        contest: Contest;
        player: any;
    }> {
        this.logger.log(`Client called GET route "/expeditions/status"`);

        //todo add class knight, villager, blessedvillager

        try {
            const expedition = await this.expeditionService.findOne(
                {
                    userAddress,
                    status: ExpeditionStatusEnum.InProgress
                },
                { playerState: 1, isCurrentlyPlaying: 1, currentNode: 1 },
            );

            const hasExpedition =
                expedition !== null && !expedition.isCurrentlyPlaying;
            const contractId =
                expedition?.playerState?.playerToken?.contractId ?? '-1';
            const nftId = expedition?.playerState?.playerToken?.tokenId ?? -1; // tokenId is not enough to avoid conflicts between collections. We have to check contract as well.
            const equippedGear = expedition?.playerState?.equippedGear ?? [];
            const tokenType =
                expedition?.playerState?.characterClass ?? 'missing';
            //todo parse for front end
            const player = expedition?.currentNode?.data?.player ?? null;
            console.log('player');
            console.log(player);
            if(player == null)
            {
                console.error('no player');
                console.log(expedition.currentNode.data);
            }
            const contest =
                expedition?.contest ??
                (await this.contestService.findActiveContest());

            return {
                hasExpedition,
                contractId,
                nftId,
                tokenType,
                equippedGear,
                contest,
                player
            };
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
        @Req() { userAddress }: AuthorizedRequest,
        @Body() payload: CreateExpeditionApiDTO,
    ): Promise<{
        expeditionCreated: boolean;
        reason?: string;
    }> {
        this.logger.log(`Client called POST route "/expeditions"`);

        const { equippedGear, tokenType: character_class } = payload;
        const playerToken: IPlayerToken = {
            walletId: payload.walletId,
            contractId: payload.contractId,
            tokenId: payload.nftId,
        };

        if (equippedGear?.length === 0) {
            // validate equippedGear vs ownedGeared
            const all_are_owned = await this.playerGearService.allAreOwned(
                userAddress,
                equippedGear,
            );
            if (!all_are_owned) {
                return { expeditionCreated: false, reason: 'wrong gear' };
            }
        }

        const hasExpedition =
            await this.expeditionService.playerHasExpeditionInProgress({
                clientId: userAddress,
            });

        if (!hasExpedition) {
            const contest = await this.contestService.findActiveContest();
            if (!contest) {
                return {
                    expeditionCreated: false,
                    reason: 'no contest found',
                };
            }

            const can_play = await this.playerWinService.canPlay(
                contest.event_id,
                playerToken.contractId,
                playerToken.tokenId,
            );

            if (!can_play) {
                return {
                    expeditionCreated: false,
                    reason: 'ineligible token',
                };
            }

            const playerName = await this.troveService.getAccountDisplayName(
                userAddress,
            );

            await this.initExpeditionProcess.handle({
                userAddress,
                playerName,
                playerToken,
                equippedGear,
                character_class,
                contest,
            });

            return { expeditionCreated: true };
        } else {
            return { expeditionCreated: true };
        }
    }

    @ApiOperation({
        summary: `Cancel the expedition`,
    })
    @Post('/cancel')
    async handleCancelExpedition(
        @Req() { userAddress }: AuthorizedRequest,
    ): Promise<{
        canceledExpedition: boolean;
    }> {
        this.logger.log(`Client called POST route "/expedition/cancel"`);

        const hasExpedition =
            await this.expeditionService.playerHasExpeditionInProgress({
                clientId: userAddress,
            });

        if (hasExpedition) {
            await this.expeditionService.update(userAddress, {
                status: ExpeditionStatusEnum.Canceled,
                isCurrentlyPlaying: false,
            });

            return { canceledExpedition: true };
        } else {
            return { canceledExpedition: false };
        }
    }

    @ApiOperation({
        summary: 'Query the expedition score',
    })
    @Get('/score')
    async handleGetScore(
        @Req() { userAddress }: AuthorizedRequest,
    ): Promise<ScoreResponse> {
        this.logger.log(`Client called GET route "/expedition/score"`);

        const expedition = await this.expeditionService.findOneTimeDesc({
            userAddress,
            $or: [
                { status: ExpeditionStatusEnum.Victory },
                { status: ExpeditionStatusEnum.Defeated },
            ],
        });

        if (!expedition) return null;

        return expedition.finalScore;
    }
}
