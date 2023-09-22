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
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from 'src/game/components/gear/gear.enum';
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

    private nonChainRarities = [];

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
        if (!validToken) {
            throw new UnauthorizedException('Bad Token');
        }

        return await this.playerGearService.getGear(
            wallet,
            this.nonChainRarityFilter,
        );
    }

    @ApiOperation({ summary: 'Get player owned gear list for API' })
    @Post('/modify')
    async postModify(@Body() payload: AlterGearApiDTO): Promise<{ oldGear: GearItem[]; newGear: GearItem[]; ignoredGear: Gear[]; }> {

        console.log('postModify: Entry. Payload:', payload);

        const { wallet, token } = payload;

        // confirm token (security layer) and get PlayerId
        if (!this.checkSecurityToken({ wallet, token })) {
            console.error('postModify: Bad Token for Wallet:', wallet);
            throw new UnauthorizedException('Bad Token');
        }

        let playerGear;


        for (let i = 0; i < payload.gear.length; i++) {
            let gearId = payload.gear[i]; // Asigna el valor de payload.gear[i] a una variable gearId
          
            switch (gearId) {
              case 3301:
                var gearItem3301 = new Gear();
                gearItem3301.gearId = 3301;
                gearItem3301.name = "Silver Prince";
                gearItem3301.category = GearCategoryEnum.Helmet;
                gearItem3301.rarity = GearRarityEnum.Epic;
                gearItem3301.trait = GearTraitEnum.Helmet; 
                gearItem3301.isActive = true
                
                playerGear.push(gearItem3301);

                break;

              default:
                console.log("Opción no válida");
            }
          }       


        try {
            playerGear = await this.playerGearService.getGear(
                wallet,
                this.nonChainRarityFilter,
            );
            console.log('postModify: Retrieved player gear for Wallet:', wallet, 'Gear:', playerGear);
        } catch (error) {
            console.error('postModify: Error fetching player gear for Wallet:', wallet, 'Error:', error.message);
            throw error;
        }

        let gears;

        for (let i = 0; i < payload.gear.length; i++) {
            let gearId = payload.gear[i]; // Asigna el valor de payload.gear[i] a una variable gearId
          
            switch (gearId) {
              case 3301:
                var gearItem3301 = new Gear();
                gearItem3301.gearId = 3301;
                gearItem3301.name = "Silver Prince";
                gearItem3301.category = GearCategoryEnum.Helmet;
                gearItem3301.rarity = GearRarityEnum.Epic;
                gearItem3301.trait = GearTraitEnum.Helmet; 
                gearItem3301.isActive = true
                
                gears.push(gearItem3301);

                break;

              default:
                console.log("Opción no válida");
            }
          }  

        try {
            gears = this.playerGearService.getGearByIds(payload.gear);
            console.log('postModify: Gears retrieved by IDs:', gears);
        } catch (error) {
            console.error('postModify: Error fetching gears by IDs. Error:', error.message);
            throw error;
        }

        try {
            switch (payload.action) {
                case GearActionApiEnum.AddGear:
                    await this.playerGearService.addGearToPlayer(wallet, gears);
                    console.log('postModify: Gears added to player. Wallet:', wallet);
                    break;
                case GearActionApiEnum.RemoveGear:
                    await this.playerGearService.removeGearFromPlayer(wallet, gears);
                    console.log('postModify: Gears removed from player. Wallet:', wallet);
                    break;
            }
        } catch (error) {
            console.error('postModify: Error processing gears for Wallet:', wallet, 'Action:', payload.action, 'Error:', error.message);
            throw error;
        }

        let oldGear;

        for (let i = 0; i < payload.gear.length; i++) {
            let gearId = payload.gear[i]; // Asigna el valor de payload.gear[i] a una variable gearId
          
            switch (gearId) {
              case 3301:
                var gearItem3301 = new Gear();
                gearItem3301.gearId = 3301;
                gearItem3301.name = "Silver Prince";
                gearItem3301.category = GearCategoryEnum.Helmet;
                gearItem3301.rarity = GearRarityEnum.Epic;
                gearItem3301.trait = GearTraitEnum.Helmet; 
                gearItem3301.isActive = true
                
                oldGear.push(gearItem3301);

                break;

              default:
                console.log("Opción no válida");
            }
          }  

        let newGear;

        for (let i = 0; i < payload.gear.length; i++) {
            let gearId = payload.gear[i]; // Asigna el valor de payload.gear[i] a una variable gearId
          
            switch (gearId) {
              case 3301:
                var gearItem3301 = new Gear();
                gearItem3301.gearId = 3301;
                gearItem3301.name = "Silver Prince";
                gearItem3301.category = GearCategoryEnum.Helmet;
                gearItem3301.rarity = GearRarityEnum.Epic;
                gearItem3301.trait = GearTraitEnum.Helmet; 
                gearItem3301.isActive = true
                
                newGear.push(gearItem3301);

                break;

              default:
                console.log("Opción no válida");
            }
          }  

        try {
            newGear = await this.playerGearService.getGear(
                wallet,
                this.nonChainRarityFilter,
            );
            console.log('postModify: Retrieved new gear for Wallet:', wallet, 'Gear:', newGear);
        } catch (error) {
            console.error('postModify: Error fetching new gear for Wallet:', wallet, 'Error:', error.message);
            throw error;
        }

        console.log('postModify: Exit. Wallet:', wallet, 'Old Gear:', playerGear, 'New Gear:', newGear);

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
