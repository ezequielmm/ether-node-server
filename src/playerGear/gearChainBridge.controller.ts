import { ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { PlayerGearService } from './playerGear.service';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Gear } from '../game/components/gear/gear.schema';
import { Expedition } from 'src/game/components/expedition/expedition.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from 'kindagoose';
import { GearRarityEnum } from 'src/game/components/gear/gear.enum';
import { remove } from 'lodash';
import { createHash } from 'crypto';
import { GearItem } from './gearItem';

class AlterGearApiDTO {
    @ApiProperty()
    readonly wallet: string;

    @ApiProperty()
    readonly token: string;

    @ApiProperty()
    readonly action: GearActionApiEnum;

    @ApiProperty()
    readonly gear: number[];
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
        @Inject(getModelToken('Expedition'))
        private readonly expedition: ReturnModelType<typeof Expedition>,
        private playerGearService: PlayerGearService,
    ) {}

    private nonChainRarities = [GearRarityEnum.Common, GearRarityEnum.Uncommon];

    private nonChainRarityFilter = {
        rarity: {
            $nin: this.nonChainRarities,
        },
    };

    private async checkSecurityToken(check: ITokenCheck): Promise<boolean> {
        const sharedSalt = process.env.GEARAPI_SALT ?? 'sharedSalt';
        const timestamp = new Date().setUTCHours(0, 0, 0, 0).valueOf();
        const localHash = createHash('md5')
            .update(timestamp + check.wallet + sharedSalt)
            .digest('hex');

        return localHash === check.token;
    }

    private async getPlayerIdFromWallet(wallet: string): Promise<number> {
        const latestExpedition = await this.expedition
            .findOne(
                {
                    'playerToken.wallet_id': wallet,
                },
                { playerId: 1 },
            )
            .sort({ createdAt: -1 })
            .lean();

        if (!latestExpedition) return;

        return latestExpedition.playerId;
    }

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Get('/list')
    async getList(
        @Param('wallet') wallet: string,
        @Param('token') token: string,
    ): Promise<GearItem[]> {
        // confirm token (security layer)
        if (!this.checkSecurityToken({ wallet, token }))
            throw new UnauthorizedException('Bad Token');

        // get player id from wallet address?
        const playerId = await this.getPlayerIdFromWallet(wallet);
        if (!playerId) throw new NotFoundException('Unknown Wallet');

        return await this.playerGearService.getGear(
            playerId,
            this.nonChainRarityFilter,
        );
    }

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Post('/modify')
    async postModify(@Body() payload: AlterGearApiDTO): Promise<{
        oldGear: GearItem[];
        newGear: GearItem[];
        ignoredGear: Gear[];
    }> {
        const { wallet, token } = payload;

        // confirm token (security layer) and get PlayerId
        if (!this.checkSecurityToken({ wallet, token }))
            throw new UnauthorizedException('Bad Token');

        // get player id from wallet address?
        const playerId = await this.getPlayerIdFromWallet(payload.wallet);
        if (!playerId) throw new NotFoundException('Unknown Wallet');

        const playerGear = await this.playerGearService.getGear(
            playerId,
            this.nonChainRarityFilter,
        );
        const gears = await this.playerGearService.getGearByIds(payload.gear);
        const removedGears = remove(gears, (g) =>
            this.nonChainRarities.includes(g.rarity),
        );

        switch (payload.action) {
            case GearActionApiEnum.AddGear:
                await this.playerGearService.addGearToPlayer(playerId, gears);
                break;
            case GearActionApiEnum.RemoveGear:
                await this.playerGearService.removeGearFromPlayer(
                    playerId,
                    gears,
                );
                break;
        }

        const newGear = await this.playerGearService.getGear(
            playerId,
            this.nonChainRarityFilter,
        );

        return {
            oldGear: playerGear,
            newGear: newGear,
            ignoredGear: removedGears,
        };
    }
}
