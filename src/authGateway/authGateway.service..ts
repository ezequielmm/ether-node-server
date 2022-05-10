import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { IProfile } from './interfaces/profile.interface';
import { isValidAuthToken } from '../utils';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGatewayService {
    constructor(private readonly http: HttpService) {}

    async getUser(token: string): Promise<AxiosResponse<IProfile>> {
        if (!isValidAuthToken(token))
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Invalid Token',
                },
                HttpStatus.UNAUTHORIZED,
            );

        return firstValueFrom(
            this.http.get(
                'https://gateway.kote.robotseamonster.com/gsrv/v1/profile',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            ),
        );
    }
}
