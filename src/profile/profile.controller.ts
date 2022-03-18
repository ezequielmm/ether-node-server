import { Controller, Get, Version } from '@nestjs/common';
import { Profile } from 'src/interfaces/ProfileInterface';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly service: ProfileService) {}

    @Version('1')
    @Get('/')
    async getProfile_V1(): Promise<Profile> {
        return await this.service.getProfile_V1();
    }
}
