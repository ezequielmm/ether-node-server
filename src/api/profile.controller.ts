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
    async handleGetProfile(@Headers() headers) {
        const { authorization } = headers;
        try {
            const {
                data: {
                    data: { id, name },
                },
            } = await this.authGatewayService.getUser(authorization);

            return { id, name, fief: 0 };
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
