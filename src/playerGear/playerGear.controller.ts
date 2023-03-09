import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { PlayerGearService } from './playerGear.service';
import { Headers } from '@nestjs/common/decorators/http/route-params.decorator';
import { Gear } from '../game/components/gear/gear.schema';

@ApiTags('playerGear')
@Controller('playerGear')
export class PlayerGearController {
    constructor(private playerGearService: PlayerGearService) {}
    @ApiOperation({ summary: 'Get player gear' })
    @Get()
    async get(@Headers('Authorization') authHeader: any): Promise<any> {
        if(!this.playerGearService) return 'this.playerGearService is null';
        return await this.playerGearService.getGear(authHeader);
    }
}
