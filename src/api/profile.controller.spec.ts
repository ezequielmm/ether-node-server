import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { ProfileController } from './profile.controller';

describe('ProfileController', () => {
    let profileController: ProfileController;
    let authGatewayService: AuthGatewayService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [
                {
                    provide: AuthGatewayService,
                    useValue: {
                        getUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        profileController = module.get<ProfileController>(ProfileController);
        authGatewayService = module.get<AuthGatewayService>(AuthGatewayService);
    });

    describe('handleGetProfile', () => {
        it('should return user profile', async () => {
            const token = 'token';
            const profile = {
                id: 'id',
                email: 'email',
                name: 'name',
            };

            jest.spyOn(authGatewayService, 'getUser').mockResolvedValue({
                data: {
                    data: profile,
                },
            } as unknown as AxiosResponse);

            expect(
                await profileController.handleGetProfile({
                    authorization: token,
                }),
            ).toEqual(profile);
        });
    });
});
