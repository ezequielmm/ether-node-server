import { Controller, Get, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Profile } from 'src/interfaces/ProfileInterface';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    constructor(private readonly service: ProfileService) {}

    @Version('1')
    @ApiOperation({
        summary: 'Get user profile',
    })
    @Get('/')
    async getProfile_V1(): Promise<Profile> {
        return await this.service.getProfile_V1();
    }
}
