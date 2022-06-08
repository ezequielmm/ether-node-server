import {
    Controller,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { IProfile } from 'src/authGateway/interfaces/profile.interface';
import { AuthGuard } from '../guards/auth.guard';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
@UseGuards(new AuthGuard())
export class ProfileController {
    private readonly logger: Logger = new Logger(ProfileController.name);

    constructor(private readonly authGatewayService: AuthGatewayService) {}

    @ApiOperation({
        summary: 'Get user profile',
    })
    @Get()
    async handleGetProfile(@Headers() headers): Promise<IProfile> {
        const { authorization: token } = headers;
        try {
            const {
                data: { data },
            } = await this.authGatewayService.getUser(token);

            return data;
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
