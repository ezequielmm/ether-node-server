import { Controller, Get, Version } from '@nestjs/common';
import { Profile } from 'src/interfaces/ProfileInterface';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly service: ProfileService) {}

    @Version('1')
    @Get('/')
    getProfile_V1(): Profile {
        return this.service.getProfile_V1();
    }
}
