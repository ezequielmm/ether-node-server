import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Socket } from 'socket.io';

interface Profile {
    data: {
        id: string;
        name: string;
        email: string;
        wallets: [];
        coins: number;
        fief: number;
        experience: number;
        level: number;
        act: number;
        act_map: string;
    };
}

@Injectable()
export class SocketService {
    constructor(private readonly http: HttpService) {}

    async getUser(token: string): Promise<AxiosResponse<Profile>> {
        token = token.startsWith('Bearer')
            ? token.replace('Bearer', '').trim()
            : token;

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

    sendErrorMessage(message: string, client: Socket): void {
        client.emit('ErrorMessage', { message });
    }
}
