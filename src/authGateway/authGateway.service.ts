import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ProfileGatewayInterface } from 'src/interfaces/profileGateway.interface';

@Injectable()
export class AuthGatewayService {
    constructor(private readonly http: HttpService) {}

    async getUser(
        token: string,
    ): Promise<AxiosResponse<ProfileGatewayInterface>> {
        if (!token) this.throwError('Invalid Token', HttpStatus.UNAUTHORIZED);

        token = token.startsWith('Bearer')
            ? token.replace('Bearer', '').trim()
            : token;

        if (!token) this.throwError('Invalid Token', HttpStatus.UNAUTHORIZED);

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

    private throwError(message: string, statusCode: HttpStatus): void {
        throw new HttpException(
            {
                data: {
                    message,
                    status: statusCode,
                },
            },
            statusCode,
        );
    }
}
