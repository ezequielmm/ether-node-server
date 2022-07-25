import { HttpService } from '@nestjs/axios';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { ProfileController } from './profile.controller';

describe('ProfileController', () => {
    let profileController: ProfileController;
    let authGatewayService: AuthGatewayService;
    let httpService: HttpService;

    beforeEach(() => {
        httpService = new HttpService();
        authGatewayService = new AuthGatewayService(httpService);
        profileController = new ProfileController(authGatewayService);
    });

    describe('Get player profile', () => {
        it(`Should return player's profile`, async () => {
            const result = {
                data: {
                    id: 4,
                    name: 'Javier Mercedes',
                    email: 'manuelmercedez10@gmail.com',
                    last_logged_in: null,
                    created_at: '2022-06-13T20:13:51.000000Z',
                    updated_at: '2022-06-13T20:13:51.000000Z',
                    last_name: null,
                    access_token: null,
                    signup_type: 'email',
                    metamask_accounts: [],
                },
            };
        });
    });
});
