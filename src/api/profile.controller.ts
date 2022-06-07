import {
    Body,
    Controller,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { ProfileService } from 'src/authGateway/profile/profile.service';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateProfileDTO } from './dto';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
@UseGuards(new AuthGuard())
export class ProfileController {
    private readonly logger: Logger = new Logger(ProfileController.name);

    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly profileService: ProfileService,
    ) {}

    @ApiOperation({
        summary: 'Get user profile',
    })
    @Get()
    async handleGetProfile(@Headers() headers): Promise<{
        name: string;
        email: string;
    }> {
        const { authorization: token } = headers;
        try {
            const {
                data: {
                    data: { id: auth_service_id },
                },
            } = await this.authGatewayService.getUser(token);

            const profile = await this.profileService.findOneByAuthServiceId(
                auth_service_id,
            );

            return {
                name: profile.name,
                email: profile.email,
            };
        } catch (e) {
            this.logger.error(e.stack);
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: e.message,
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    @ApiOperation({
        summary: 'Update user profile',
    })
    @Post('/update')
    async handleUpdateProfile(
        @Headers() headers,
        @Body() payload: UpdateProfileDTO,
    ): Promise<{
        name: string;
        email: string;
    }> {
        const { authorization: token } = headers;
        const { username } = payload;
        try {
            const {
                data: { data: profile },
            } = await this.authGatewayService.getUser(token);

            const { id, name, email } = profile;

            const updatedProfile = await this.profileService.updateOrCreate({
                auth_service_id: id,
                name,
                email,
                username,
            });

            return {
                name: updatedProfile.name,
                email: updatedProfile.email,
            };
        } catch (e) {
            this.logger.error(e.stack);
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: e.message,
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
}
