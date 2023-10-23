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
    Query,
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
import { Expedition, IPlayerToken } from 'src/game/components/expedition/expedition.schema';
import { PlayerWinService } from 'src/playerWin/playerWin.service';
import { AuthorizedRequest } from 'src/auth/auth.types';
import { TroveService } from 'src/trove/trove.service';

class IsFinishedFirstStageApiDTO {
    @ApiProperty()
    readonly wallet: string;    
    @ApiProperty()
    readonly expeditionId: string;
}

@ApiBearerAuth()
@ApiTags('Expedition')
@Controller('expeditions')
// @UseGuards(AuthGuard)
export class IsFirstStageFinishedController {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly initExpeditionProcess: InitExpeditionProcess,
        private readonly scoreCalculatorService: ScoreCalculatorService,
        private readonly playerGearService: PlayerGearService,
        private readonly playerWinService: PlayerWinService,
        private readonly troveService: TroveService,
        private contestService: ContestService,
    ) { }

    private readonly logger: Logger = new Logger(IsFirstStageFinishedController.name);

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Get('/isFinishedFirstStage') async getList(@Query('expeditionId') expeditionId: string, @Query('wallet') wallet: string): Promise<boolean> {
        // confirm token (security layer)
        // let validToken = await this.checkSecurityToken({ wallet, token });
        // if(!validToken) {
        //     throw new UnauthorizedException('Bad Token');
        // }

        return await this.expeditionService.checkCurrentStage(expeditionId, wallet)

    }
}


