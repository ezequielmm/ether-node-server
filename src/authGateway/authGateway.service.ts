import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { IAuthProfile } from './authGateway.interface';

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
