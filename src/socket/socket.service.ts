import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { firstValueFrom, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Profile } from 'src/interfaces/ProfileInterface';

@Injectable()
export class SocketService {
    constructor(private readonly http: HttpService) {}

    async getUser(token: string): Promise<AxiosResponse<Profile>> {
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
