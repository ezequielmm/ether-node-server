import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { TrinketService } from '../game/components/trinket/trinket.service';

@ApiBearerAuth()
@ApiTags('Trinket')
@Controller('trinkets')
@UseGuards(new AuthGuard())
export class TrinketController {
    constructor(private readonly trinketService: TrinketService) {}

    @ApiOperation({
        summary: 'Get all trinkets',
    })
    @Get()
    async handleGetTrinkets() {
        const trinkets = await this.trinketService.findAll();
        return trinkets.map((trinket) => {
            return {
                id: trinket._id,
                name: trinket.name,
                rarity: trinket.rarity,
                coinCost: trinket.coinCost,
                effects: trinket.effects,
            };
        });
    }
}
