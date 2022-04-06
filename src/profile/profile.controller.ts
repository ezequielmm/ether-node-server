import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileInterface } from 'src/interfaces/profile.interface';
import { ProfileService } from './profile.service';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @ApiOperation({
        summary: 'Get user profile',
    })
    @Get()
    async handleGetProfile(): Promise<ProfileInterface> {
        return await this.profileService.getProfile();
    }
}
