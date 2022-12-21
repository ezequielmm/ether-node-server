import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IProfile } from './authGateway.interface';
import { ConfigService } from '@nestjs/config';
import { getBearerToken } from 'src/utils';

@Injectable()
export class AuthGatewayService {
    constructor(
        private readonly http: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async getUser(token: string): Promise<IProfile> {
        token = getBearerToken(token);

        const userRoute = this.configService.get<string>('GET_PROFILE_URL');

        const {
            data: { data },
        } = await firstValueFrom(
            this.http.get<{ data: IProfile }>(userRoute, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        );

        return data;
    }
}
