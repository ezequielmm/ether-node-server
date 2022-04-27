import {
    Controller,
    Get,
    UseGuards,
    Post,
    Headers,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { AuthGatewayService } from '../authGateway/authGateway.service.';

@ApiBearerAuth()
@ApiTags('Expedition')
@Controller('expeditions')
@UseGuards(new AuthGuard())
export class ExpeditionController {
    constructor(private readonly authGatewayService: AuthGatewayService) {}

    @ApiOperation({
        summary: 'Get if the user has an expedition in progress or not',
    })
    @Get('/status')
    async handleGetExpeditionStatus(@Headers() headers): Promise<{
        hasExpedition?: boolean;
    }> {
        const { authorization } = headers;

        try {
            const {
                data: {
                    data: { id: player_id },
                },
            } = await this.authGatewayService.getUser(authorization);

            return { hasExpedition: true };
        } catch (e) {
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
        summary: `Creates a new expedition for the player`,
    })
    @Post()
    async handleCreateExpedition(): Promise<{ createdExpedition: boolean }> {
        return {
            createdExpedition: true,
        };
    }
}
