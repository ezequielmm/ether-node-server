import { ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlayerGearService } from './playerGear.service';
import { Headers, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Gear } from '../game/components/gear/gear.schema';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { GearItem } from './gearItem';

class AddGearFromChainApiDTO {
    @ApiProperty()
    readonly wallet: string;

    @ApiProperty()
    readonly token: string;

    @ApiProperty()
    readonly gearToAdd: GearItem[];
}

class DeleteGearFromChainApiDTO {
    @ApiProperty()
    readonly wallet: string;
    
    @ApiProperty()
    readonly token: string;

    @ApiProperty()
    readonly gearToRemove: GearItem[];
}

enum GearActionApiEnum {
    AddGear = 'add',
    RemoveGear = 'delete',
}

@ApiTags('gearChainBridge')
@Controller('gearChainBridge')
export class GearChainBridgeController {
    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private playerGearService: PlayerGearService
    ) {}

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Get('/list')
    async getList(
        @Param('wallet') wallet: string, 
        @Param('token') token: string
    ): Promise<any> {
        
        // confirm token (security layer) and get PlayerId
        if (!this.checkToken(payload.wallet, payload.token)) {
            return "Bad Token";
        }
        // get player id from wallet address?
        const playerId = await this.getPlayerIdFromWallet(payload.wallet);

        return await this.playerGearService.getGear(playerId);
    }

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Post('/add')
    async postAdd(
        @Body() payload: AddGearFromChainApiDTO,
    ): Promise<any> {
        
        // confirm token (security layer) and get PlayerId
        if (!this.checkToken(payload.wallet, payload.token)) {
            return "Bad Token";
        }

        // get player id from wallet address?
        const playerId = await this.getPlayerIdFromWallet(payload.wallet);

        return await this.alterPlayerGear(playerId, GearActionApiEnum.AddGear, payload.gearToAdd);
    }

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Post('/remove')
    async postAdd(
        @Body() payload: AddGearFromChainApiDTO,
    ): Promise<any> {
        
        // confirm token (security layer) and get PlayerId
        if (!this.checkToken(payload.wallet, payload.token)) {
            return "Bad Token";
        }

        // get player id from wallet address?
        const playerId = await this.getPlayerIdFromWallet(payload.wallet);

        return await this.alterPlayerGear(playerId, GearActionApiEnum.RemoveGear, payload.gearToAdd);
    }


    private async getPlayerIdFromWallet(
        wallet: string,
    ): Promise<number> {
        // STUB: TODO: Make this actually return the player ID based on the wallet address (or fail)
        const playerId = 0;
        return playerId;
    }

    private async checkToken(
        wallet: string,
        token: string,
    ): Promise<bool> {
        // STUB: TODO: Make this actually check the token value.
        const validToken = true;
        return validToken;
    }

    private async alterPlayerGear(
        playerId: string, 
        action: GearActionApiEnum,
        gearList: GearItem[],
    ): Promise<any> {

        // STUB: TODO: Add or Remove (action) gear (gearList) from player (playerId)

    }

}