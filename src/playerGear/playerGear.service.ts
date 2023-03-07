import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { data } from '../game/components/gear/gear.data';
import { Gear } from '../game/components/gear/gear.schema';
@Injectable()
export class PlayerGearService {
    constructor(
        @InjectModel(PlayerGear)
        private readonly playerGear: ReturnModelType<typeof PlayerGear>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async getGear(authToken: string): Promise<Gear[]> {
        const url = this.configService.get<string>('GET_PROFILE_URL');
        const authServiceApiKey = this.configService.get<string>(
            'GET_PROFILE_API_KEY',
        ); // 'api-key' header
        const data = await firstValueFrom(
            this.httpService.get<any>(url, {
                headers: {
                    Authorization: authToken,
                    'api-key': authServiceApiKey,
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

        const p: PlayerGear = {
            playerId: playerId,
            gear: [
                data[0],
                data[1],
                data[2],
                data[24],
                data[41],
                data[71],
                data[91],
                data[112],
                data[131],
                data[151],
                data[169],
                data[182],
            ],
        };
        await this.playerGear.create(p);
    }
}
