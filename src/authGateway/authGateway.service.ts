import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IAuthProfile } from './interfaces/profile.interface';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthGatewayService {
    constructor(private readonly http: HttpService) {}

    async getUser(token: string): Promise<AxiosResponse<IAuthProfile>> {
        token = token.replace('Bearer', '');

        const userRoute = process.env.GET_PROFILE_URL;

        return await firstValueFrom(
            this.http.get(userRoute, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        );
    }
}
