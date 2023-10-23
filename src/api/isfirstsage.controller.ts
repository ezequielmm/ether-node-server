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


class IsFinishedFirstStageApiDTO {
    @ApiProperty()
    readonly wallet: string;    
}

@ApiBearerAuth()
@ApiTags('Expedition')
@Controller('expeditions')
// @UseGuards(AuthGuard)
export class IsFirstStageFinishedController {
    constructor(
        private readonly expeditionService: ExpeditionService,
    ) { }

    private readonly logger: Logger = new Logger(IsFirstStageFinishedController.name);

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Get('/isFinishedFirstStage') async getList(@Query('wallet') wallet: string): Promise<boolean> {

        return await this.expeditionService.checkCurrentStage(wallet)

    }
}


