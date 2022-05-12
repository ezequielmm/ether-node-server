import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
@UseGuards(new AuthGuard())
export class ProfileController {
    @ApiOperation({
        summary: 'Get user profile',
    })
    @Get()
    handleGetProfile() {
        return {
            id: '9f3ce210-5edc-4d2c-a33e-19630b101578',
            name: 'John Doe',
            email: 'john@gmail.com',
            wallets: [],
            act_map: '5f97e1e4-b534-4624-89b0-b4a2da9ca416',
            player: {
                id: '9f3ce210-5edc-4d2c-a33e-19630b101578',
                royal_house: '5f97e1e4-b534-4624-89b0-b4a2da9ca416',
                class: 'knight',
                current_act: 1,
                current_node: 1,
                experience: 1500,
                fief: 10,
                coins: 100,
                status: 'active',
            },
        };
    }
}
