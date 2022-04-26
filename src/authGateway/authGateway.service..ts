import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { IProfile } from './interfaces/profile.interface';
import {isValidAuthToken} from "../utils";

@Injectable()
export class AuthGatewayService {
    constructor(private readonly http: HttpService) {}

    async getUser(token: string): Promise<AxiosResponse<IProfile>> {
        if (isValidAuthToken(token)) 
    }
}
