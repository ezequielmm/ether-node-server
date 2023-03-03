import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { GearItem } from './gearItem';
@Injectable()
export class PlayerGearService {
    constructor(
        @InjectModel(PlayerGear)
        private readonly playerGear: ReturnModelType<typeof PlayerGear>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async getGear(authToken: string): Promise<GearItem[]> {
        const url = this.configService.get<string>('GET_PROFILE_URL');
        const data = await firstValueFrom(
            this.httpService.get<any>(url, {
                headers: {
                    Authorization: authToken,
                },
            }),
        );
        const playerId = data.data.data.id;
        await this.dev_addLootForDevelopmentTesting(playerId);
        const gearList = await this.playerGear.findOne({
            playerId: playerId,
        });
        return gearList.gear;
    }

    async dev_addLootForDevelopmentTesting(playerId: string) {
        const gearList = await this.playerGear.findOne({
            playerId: playerId,
        });
        if (gearList) return;

        const g1: GearItem = {
            name: 'a name',
            trait: 'a trait',
            category: 'a category',
            rarity: 'a rarity',
        };
        const g2: GearItem = {
            name: '2 name',
            trait: '2 trait',
            category: '2 category',
            rarity: '2 rarity',
        };
        const p: PlayerGear = {
            playerId: playerId,
            gear: [g1, g2],
        };
        await this.playerGear.create(p);
    }
}
