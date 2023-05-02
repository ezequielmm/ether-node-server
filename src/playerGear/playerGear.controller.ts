import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { PlayerGearService } from './playerGear.service';
import { Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { Logger } from '@nestjs/common';
import { AuthorizedRequest } from 'src/auth/auth.types';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('playerGear')
@Controller('playerGear')
@UseGuards(AuthGuard)
export class PlayerGearController {
    private readonly logger: Logger = new Logger(PlayerGearController.name);

    constructor(private playerGearService: PlayerGearService) {}

    @ApiOperation({ summary: 'Get player gear' })
    @Get()
    async get(@Req() { userAddress }: AuthorizedRequest): Promise<any> {
        const ownedGearGear = await this.playerGearService.getGear(userAddress);
        return { ownedGear: ownedGearGear };
    }
}
