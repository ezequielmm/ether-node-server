import { ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlayerGearService } from './playerGear.service';
import { Headers, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Gear } from '../game/components/gear/gear.schema';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { GearItem } from './gearItem';


class AlterGearApiDTO {
    @ApiProperty()
    readonly wallet: string;

    @ApiProperty()
    readonly token: string;

    @ApiProperty()
    readonly action: GearActionApiEnum;

    @ApiProperty()
    readonly gear: GearItem[];
}

enum GearActionApiEnum {
    AddGear = 'add',
    RemoveGear = 'delete',
}

interface ITokenCheck {
    wallet: string;
    token: string;
}

@ApiTags('gearChainBridge')
@Controller('gearChainBridge')
export class GearChainBridgeController {
    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private playerGearService: PlayerGearService
    ) {}

    private async checkSecurityToken(check: ITokenCheck): Promise<boolean> {
        const sharedSalt = process.env.GEARAPI_SALT;
        const timestamp = new Date().setUTCHours(0,0,0,0).valueOf();
        const crypto = require('node:crypto');
        const localHash = crypto.createHash('md5').update(timestamp + check.wallet + sharedSalt).digest('hex');

        return (localHash == check.token);
    }

    private async getPlayerIdFromWallet(
        wallet: string,
    ): Promise<number> {
        const playerId = 0;

        return playerId;
    }

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Get('/list')
    async getList(
        @Param('wallet') wallet: string, 
        @Param('token') token: string
    ): Promise<any> {
        
        // confirm token (security layer) and get PlayerId
        if (!this.checkSecurityToken({wallet, token})) {
            return "Bad Token";
        }

        // get player id from wallet address?
        const playerId = await this.getPlayerIdFromWallet(wallet);
        if (!playerId) {
            return "Unknown Player";
        }

        return await this.playerGearService.getGear(playerId);
    }

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Post('/modify')
    async postModify(
        @Body() payload: AlterGearApiDTO,
    ): Promise<any> {
        // confirm token (security layer) and get PlayerId
        if (!this.checkSecurityToken({wallet: payload.wallet, token: payload.token})) {
            return "Bad Token";
        }

        // get player id from wallet address?
        const playerId = await this.getPlayerIdFromWallet(payload.wallet);
        if (!playerId) {
            return "Unknown Player";
        }

        switch (payload.action) {
            case GearActionApiEnum.AddGear:
                
                break;
            case GearActionApiEnum.RemoveGear:

                break;
        }

    }

}