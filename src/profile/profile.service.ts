import { Injectable } from '@nestjs/common';
import { Profile } from 'src/interfaces/ProfileInterface';

@Injectable()
export class ProfileService {
    /**
     * Get profile information
     * @version 1
     * @returns profile
     */
    getProfile_V1(): Profile {
        return {
            id: '9f3ce210-5edc-4d2c-a33e-19630b101578',
            name: 'John Doe',
            email: 'john@gmail.com',
            wallets: [],
            coins: 100,
            fief: 10,
            experience: 1500,
            level: 3,
            act: 1,
            act_map: '5f97e1e4-b534-4624-89b0-b4a2da9ca416',
        };
    }
}
