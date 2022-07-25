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
            const result = { data: {} };
        });
    });
});
