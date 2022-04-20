import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProfileInterface } from 'src/interfaces/profile.interface';
import { ProfileService } from './profile.service';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
@UseGuards(new AuthGuard())
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
