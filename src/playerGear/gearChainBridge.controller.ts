import { ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { PlayerGearService } from './playerGear.service';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { Gear } from '../game/components/gear/gear.schema';
import { Expedition } from 'src/game/components/expedition/expedition.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from 'kindagoose';
import { GearRarityEnum } from 'src/game/components/gear/gear.enum';
import { remove } from 'lodash';
import { createHash } from 'crypto';
import { GearItem } from './gearItem';
import { ConfigService } from '@nestjs/config';

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
        private readonly configService: ConfigService,
    ) {}

    private nonChainRarities = [GearRarityEnum.Common, GearRarityEnum.Uncommon];

    private nonChainRarityFilter = {
        rarity: {
            $nin: this.nonChainRarities,
        },
    };

    private async checkSecurityToken(check: ITokenCheck): Promise<boolean> {
        const sharedSalt = this.configService.get<string>(
            'GEARAPI_SALT',
            'sharedSalt',
        );
        const timestamp = new Date().setUTCHours(0, 0, 0, 0).valueOf();
        const localHash = createHash('md5')
            .update(timestamp + check.wallet + sharedSalt)
            .digest('hex');
        
        return localHash === check.token;
    }

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Get('/list') async getList(@Query('wallet') wallet: string, @Query('token') token: string): Promise<GearItem[]> {
        // confirm token (security layer)
        let validToken = await this.checkSecurityToken({ wallet, token });
        if (!validToken){
            throw new UnauthorizedException('Bad Token');
        }

        return await this.playerGearService.getGear(
            wallet,
            this.nonChainRarityFilter,
        );
    }

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Post('/modify')
    async postModify(@Body() payload: AlterGearApiDTO): Promise<{oldGear: GearItem[]; newGear: GearItem[]; ignoredGear: Gear[];}> {
        
        const { wallet, token } = payload;

        // confirm token (security layer) and get PlayerId
        if (!this.checkSecurityToken({ wallet, token })){
            throw new UnauthorizedException('Bad Token');
        }

        let playerGear = await this.playerGearService.getGear(
            wallet,
            this.nonChainRarityFilter,
        );


        let gears = await this.playerGearService.getGearByIds(payload.gear);

        const removedGears = remove(gears, (g) =>
            this.nonChainRarities.includes(g.rarity),
        );

        switch (payload.action) {
            case GearActionApiEnum.AddGear:
                gears = gears.filter((g) => {
                    return !playerGear.some((pg) => pg.gearId === g.gearId)
                });
                await this.playerGearService.addGearToPlayer(wallet, gears);
                break;
            case GearActionApiEnum.RemoveGear:
                gears = gears.filter((g) => {
                    return playerGear.some((pg) => pg.gearId === g.gearId)
                });
                await this.playerGearService.removeGearFromPlayer(wallet,gears);
                break;
        }

        const newGear = await this.playerGearService.getGear(
            wallet,
            this.nonChainRarityFilter,
        );

        return {
            oldGear: playerGear,
            newGear: newGear,
            ignoredGear: removedGears,
        };
    }
}
