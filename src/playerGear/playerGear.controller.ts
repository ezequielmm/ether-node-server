import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { PlayerGearService } from './playerGear.service';
import { Headers } from '@nestjs/common/decorators/http/route-params.decorator';
import { GearItem } from './gearItem';

@ApiTags('playerGear')
@Controller('playerGear')
export class PlayerGearController {
    constructor(private playerGearService: PlayerGearService) {}
    @ApiOperation({ summary: 'Get player gear' })
    @Get()
    async get(@Headers('Authorization') authHeader: any): Promise<GearItem[]> {
        console.log(authHeader);
        return await this.playerGearService.getGear(authHeader);
    }
}
