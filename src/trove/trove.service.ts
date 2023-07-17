import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TroveAccountDomains } from './trove.types';
import { ConfigService } from '@nestjs/config';

const TROVE_API_URL = 'https://trove-api.treasure.lol';

@Injectable()
export class TroveService {

    constructor(private readonly configService: ConfigService) {}

    async getAccountDomains(userAddress: string): Promise<TroveAccountDomains> {

        const api_key = this.configService.get<string>('TRESAURE_API_KEY');

        const res = await axios.get<TroveAccountDomains>(
            `${TROVE_API_URL}/domain/${userAddress}`,
            {
                headers: {
                    "X-API-Key": api_key,
                },
            }
        );
        return res.data;
    }

    async getAccountDisplayName(userAddress: string): Promise<string> {
        const domains = await this.getAccountDomains(userAddress);
        const shortAddress = `${userAddress.substring(
            0,
            6,
        )}...${userAddress.substring(userAddress.length - 4)}`;

        switch (domains?.preferredDomainType) {
            case 'smol':
                return domains?.smol?.name || shortAddress;
            case 'ens':
                return domains?.ens?.name || shortAddress;
            case 'treasuretag':
                return domains?.treasuretag?.name || shortAddress;
        }

        return shortAddress;
    }
}
