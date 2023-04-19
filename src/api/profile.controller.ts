import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthorizedRequest } from 'src/auth/auth.types';
import { TroveService } from 'src/trove/trove.service';
import { Profile } from './profile.types';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
    private readonly logger: Logger = new Logger(ProfileController.name);

    constructor(private readonly troveService: TroveService) {}

    @ApiOperation({
        summary: 'Get user profile',
    })
    @Get()
    async handleGetProfile(
        @Req() { userAddress }: AuthorizedRequest,
    ): Promise<Profile> {
        this.logger.log(`Client called GET route "/profile"`);
        const displayName = await this.troveService.getAccountDisplayName(
            userAddress,
        );
        return { userAddress, displayName };
    }
}
