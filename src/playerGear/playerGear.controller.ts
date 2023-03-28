import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { PlayerGearService } from './playerGear.service';
import { Headers } from '@nestjs/common/decorators/http/route-params.decorator';
import { Gear } from '../game/components/gear/gear.schema';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { Logger } from '@nestjs/common';

@ApiTags('playerGear')
@Controller('playerGear')
export class PlayerGearController {
    private readonly logger: Logger = new Logger(PlayerGearController.name);

    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private playerGearService: PlayerGearService
    ) {}

    @ApiOperation({ summary: 'Get player gear' })
    @Get()
    async get(@Headers('Authorization') authHeader: any): Promise<any> {
        
        const { id: playerId } = await this.authGatewayService.getUser(
            authHeader,
        );
        if (!playerId) return 'no playerId';
        
        const ownedGearGear = await this.playerGearService.getGear(playerId);
        
        return { ownedGear: ownedGearGear };
    }
}
