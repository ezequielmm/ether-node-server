import { Test, TestingModule } from '@nestjs/testing';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { ExpeditionStatusEnum } from 'src/game/components/expedition/expedition.enum';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { InitExpeditionProcess } from 'src/game/process/initExpedition.process';
import { ExpeditionController } from './expedition.controller';

describe('ExpeditionController', () => {
    let expeditionController: ExpeditionController;
    let expeditionService: ExpeditionService;
    let authGatewayService: AuthGatewayService;
    let initExpeditionProcess: InitExpeditionProcess;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExpeditionController],
            providers: [
                {
                    provide: ExpeditionService,
                    useValue: {
                        playerHasExpeditionInProgress: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: AuthGatewayService,
                    useValue: {
                        getUser: jest.fn(),
                    },
                },
                {
                    provide: InitExpeditionProcess,
                    useValue: {
                        handle: jest.fn(),
                    },
                },
            ],
        }).compile();

        expeditionController =
            module.get<ExpeditionController>(ExpeditionController);
        expeditionService = module.get<ExpeditionService>(ExpeditionService);
        authGatewayService = module.get<AuthGatewayService>(AuthGatewayService);
        initExpeditionProcess = module.get<InitExpeditionProcess>(
            InitExpeditionProcess,
        );
    });

    describe('handleGetExpeditionStatus', () => {
        it('should return true if player has expedition in progress', async () => {
            const token = 'token';
            const playerId = 'playerId';

            jest.spyOn(authGatewayService, 'getUser').mockResolvedValue({
                data: { data: { id: playerId } },
            } as any);

            jest.spyOn(
                expeditionService,
                'playerHasExpeditionInProgress',
            ).mockResolvedValue(true);

            expect(
                await expeditionController.handleGetExpeditionStatus({
                    authorization: token,
                }),
            ).toEqual({ hasExpedition: true });
        });

        it('should return false if player has no expedition in progress', async () => {
            const token = 'token';
            const playerId = 'playerId';

            jest.spyOn(authGatewayService, 'getUser').mockResolvedValue({
                data: { data: { id: playerId } },
            } as any);

            jest.spyOn(
                expeditionService,
                'playerHasExpeditionInProgress',
            ).mockResolvedValue(false);

            expect(
                await expeditionController.handleGetExpeditionStatus({
                    authorization: token,
                }),
            ).toEqual({ hasExpedition: false });
        });
    });

    describe('handleCreateExpedition', () => {
        it('should return expedition created response', async () => {
            const token = 'token';
            const playerId = 'playerId';
            const playerName = 'playerName';
            const email = 'email';

            jest.spyOn(authGatewayService, 'getUser').mockResolvedValue({
                data: {
                    data: {
                        id: playerId,
                        name: playerName,
                        email,
                    },
                },
            } as any);

            jest.spyOn(initExpeditionProcess, 'handle').mockResolvedValue();

            expect(
                await expeditionController.handleCreateExpedition({
                    authorization: token,
                }),
            ).toEqual({ expeditionCreated: true });
        });

        it('should return expedition created response if is already created', async () => {
            const token = 'token';
            const playerId = 'playerId';
            const playerName = 'playerName';
            const email = 'email';

            jest.spyOn(authGatewayService, 'getUser').mockResolvedValue({
                data: {
                    data: {
                        id: playerId,
                        name: playerName,
                        email,
                    },
                },
            } as any);

            jest.spyOn(
                expeditionService,
                'playerHasExpeditionInProgress',
            ).mockResolvedValue(true);

            expect(
                await expeditionController.handleCreateExpedition({
                    authorization: token,
                }),
            ).toEqual({ expeditionCreated: true });

            expect(initExpeditionProcess.handle).not.toHaveBeenCalled();
        });
    });

    describe('handleCancelExpedition', () => {
        it('should return expedition cancelled response', async () => {
            const token = 'token';
            const playerId = 'playerId';
            const playerName = 'playerName';
            const email = 'email';

            jest.spyOn(authGatewayService, 'getUser').mockResolvedValue({
                data: {
                    data: {
                        id: playerId,
                        name: playerName,
                        email,
                    },
                },
            } as any);

            jest.spyOn(
                expeditionService,
                'playerHasExpeditionInProgress',
            ).mockResolvedValue(true);

            jest.spyOn(expeditionService, 'update').mockResolvedValue(
                undefined,
            );

            expect(
                await expeditionController.handleCancelExpedition({
                    authorization: token,
                }),
            ).toEqual({ canceledExpedition: true });

            expect(expeditionService.update).toHaveBeenCalledWith(
                playerId,
                expect.objectContaining({
                    status: ExpeditionStatusEnum.Canceled,
                }),
            );
        });

        it('should return expedition as not cancelled response', async () => {
            const token = 'token';
            const playerId = 'playerId';
            const playerName = 'playerName';
            const email = 'email';

            jest.spyOn(authGatewayService, 'getUser').mockResolvedValue({
                data: {
                    data: {
                        id: playerId,
                        name: playerName,
                        email,
                    },
                },
            } as any);

            jest.spyOn(
                expeditionService,
                'playerHasExpeditionInProgress',
            ).mockResolvedValue(false);

            expect(
                await expeditionController.handleCancelExpedition({
                    authorization: token,
                }),
            ).toEqual({ canceledExpedition: false });
        });
    });
});
