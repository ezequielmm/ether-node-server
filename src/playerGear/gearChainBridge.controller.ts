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
import { InitiationBridgeResponse, InitiationRequestDTO } from 'src/bridge-api/bridge.types';
import { NFTService } from 'src/nft-library/services/nft_service';
import { BridgeService } from 'src/bridge-api/bridge.service';

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
        private readonly nftService: NFTService,
        private readonly bridgeService: BridgeService
    ) { }

    //todo: remove next block:
    // private nonChainRarities = [];

    // private nonChainRarityFilter = {
    //     rarity: {
    //         $nin: this.nonChainRarities,
    //     },
    // };

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
        if (!validToken) {
            throw new UnauthorizedException('Bad Token');
        }

        return await this.playerGearService.getGear(
            wallet,
        );
    }

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Post('/modify')
    async postModify(@Body() payload: AlterGearApiDTO): Promise<{ oldGear: GearItem[]; newGear: GearItem[]; ignoredGear: Gear[]; }> {

        const { wallet, token, action, gear } = payload;

        // confirm token (security layer) and get PlayerId
        if (!this.checkSecurityToken({ wallet, token })) {
            console.error('postModify: Bad Token for Wallet:', wallet);
            throw new UnauthorizedException('Bad Token');
        }

        let playerGear;

        try {
            playerGear = await this.playerGearService.getGear(wallet);
            console.log("Player Gear amount: " + playerGear.length)
        } catch (error) {
            console.error('postModify: Error fetching player gear for Wallet:', wallet, 'Error:', error.message);
            throw error;
        }

        let gears;

        try {
            gears = this.playerGearService.getGearByIds(gear);
        } catch (error) {
            console.error('postModify: Error fetching gears by IDs. Error:', error.message);
            throw error;
        }

        let newGear;

        try {
            switch (action) {
                case GearActionApiEnum.AddGear:
                    newGear = (await this.playerGearService.addGearToPlayer(wallet, gears)).gear;
                    break;
                case GearActionApiEnum.RemoveGear:
                    newGear = (await this.playerGearService.removeGearFromPlayer(wallet, gears)).gear;
                    break;
            }
        } catch (error) {
            console.error('postModify: Error processing gears for Wallet:', wallet, 'Action:', action, 'Error:', error.message);
            throw error;
        }

        return {
            oldGear: playerGear,
            newGear: newGear,
            ignoredGear: [],
        };
    }

    @ApiOperation({ summary: 'Forwards to the Item Bridge server with an initiation command.' })
    @Post('/initiation')
    async inititation(@Body() payload: InitiationRequestDTO): Promise<InitiationBridgeResponse> {

        //- Validate the tokenId is owned by the given wallet:
        const NFTFromWallet = await this.nftService.isTokenIdFromWallet(payload.contract, payload.tokenId, payload.wallet);
        if (!NFTFromWallet) {
            return {
                success: false,
                message: "NFT is not owned by the given wallet address."
            }
        }

        //- Validate the wallet has the Gears:
        const ownedGears = await this.playerGearService.allAreOwnedById(payload.wallet, payload.gearIds);

        if (!ownedGears) {
            return {
                success: false,
                message: "Not all gears are associated with the walletId."
            }
        }

        try {
            //- Validate the tokenId is not in inititation progress already:

            const NFTinProgerss = await this.bridgeService.isTokenIdInProgress(payload.tokenId, payload.contract);
            if (NFTinProgerss) {
                return {
                    success: false,
                    message: "NFT already in progress."
                }
            }

            //- Invoke Bridge to make the inititalization:
            const response = await this.bridgeService.createInititation(payload);

            return response;

        } catch {
            return {
                success: false,
                message: "Error connecting to Bridge API"
            }
        }
    }
}
