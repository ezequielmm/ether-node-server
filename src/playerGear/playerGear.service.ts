import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { Prop, ReturnModelType } from '@typegoose/typegoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { data } from '../game/components/gear/gear.data';
import { Gear } from '../game/components/gear/gear.schema';
import { GearItem } from './gearItem';
import {
    GearCategoryEnum,
    GearRarityEnum,
    GearTraitEnum,
} from '../game/components/gear/gear.enum';
import { ExpeditionService } from '../game/components/expedition/expedition.service';
import { ExpeditionStatusEnum } from '../game/components/expedition/expedition.enum';
@Injectable()
export class PlayerGearService {
    private readonly logger: Logger = new Logger(PlayerGearService.name);

    constructor(
        @InjectModel(PlayerGear)
        private readonly playerGear: ReturnModelType<typeof PlayerGear>,
        private readonly expeditionService: ExpeditionService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async getGear(authToken: string): Promise<any> {
        if (!this.configService) return 'no configService';
        const url = this.configService.get<string>('GET_PROFILE_URL');
        if (!url) return 'no url';
        const authServiceApiKey = this.configService.get<string>(
            'GET_PROFILE_API_KEY',
        ); // 'api-key' header
        if (!authServiceApiKey) return 'no authServiceApiKey';
        const data = await firstValueFrom(
            this.httpService.get<any>(url, {
                headers: {
                    Authorization: authToken,
                    'api-key': authServiceApiKey,
                },
            }),
        );
        if (!data) return 'no data';
        if (!data.data) return 'no data.data';
        if (!data.data.data) return 'no data.data.data';
        const playerId = data.data.data.id;
        if (!playerId) return 'no playerId';
        const errorMessage = await this.dev_addLootForDevelopmentTesting(
            playerId,
        );
        if (errorMessage) return errorMessage;
        let ownedGear = null;
        try {
            ownedGear = await this.playerGear.findOne({
                playerId: playerId,
            });
        } catch (e) {
            return 'playerGear.findOne failed';
        }
        if (!ownedGear) return 'no ownedGear';
        let expedition = null;
        try {
            expedition = await this.expeditionService.findOneTimeDesc({
                playerId,
            });
        } catch (e) {
            return 'expeditionService.findOneTimeDesc failed';
        }
        let equippedGear = undefined;
        if (expedition) {
            const playerState = expedition.playerState;
            if (playerState) {
                equippedGear = playerState.equippedGear;
            }
        }
        if (!equippedGear) equippedGear = [];
        const ownedGearGear = ownedGear ? ownedGear.equippedGear : [];
        return {
            ownedGear: ownedGearGear,
            equippedGear: equippedGear,
        };
    }

    async dev_addLootForDevelopmentTesting(playerId: string) {
        try {
            const gearList = await this.playerGear.findOne({
                playerId: playerId,
            });
            if (gearList) return;
        } catch (e) {
            return 'playerGear.findOne failed';
        }
        const p: PlayerGear = {
            playerId: playerId,
            gear: [
                this.toGearItem(data[0]),
                this.toGearItem(data[1]),
                this.toGearItem(data[2]),
                this.toGearItem(data[24]),
                this.toGearItem(data[41]),
                this.toGearItem(data[71]),
                this.toGearItem(data[91]),
                this.toGearItem(data[112]),
                this.toGearItem(data[131]),
                this.toGearItem(data[151]),
                this.toGearItem(data[169]),
                this.toGearItem(data[182]),
            ],
        };
        try {
            await this.playerGear.create(p);
        } catch (e) {
            return 'create failed';
        }
        return null;
    }

    toGearItem(gear: Gear): GearItem {
        return {
            gearId: gear.gearId,
            name: gear.name,
            trait: gear.trait,
            category: gear.category,
            rarity: gear.rarity,
        };
    }
}
