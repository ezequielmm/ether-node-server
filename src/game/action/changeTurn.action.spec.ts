import {
    DebugLogger,
    IntegrationTestServer,
} from 'src/tests/integrationTestServer';
import { ServerSocketGatewayMock } from 'src/tests/serverSocketGatewayMock';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import {
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { ChangeTurnAction } from './changeTurn.action';

describe('ChangeTurnAction', () => {
    let its: IntegrationTestServer;
    let changeTurnAction: ChangeTurnAction;
    let mockedSocketGateway: ServerSocketGatewayMock;

    beforeAll(async () => {
        its = new IntegrationTestServer();
        await its.start({
            providers: [ChangeTurnAction, ServerSocketGatewayMock],
            models: [],
            logger: DebugLogger,
        });
        changeTurnAction = its.getInjectable(ChangeTurnAction);
        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
    });

    it('trigger change turn action', async () => {
        const clientSocket = await its.addNewSocketConnection();
        const cases: (SWARMessageType.BeginTurn | SWARMessageType.EndTurn)[] = [
            SWARMessageType.EndTurn,
            SWARMessageType.BeginTurn,
        ];

        for (const c of cases) {
            let putDataMessage;
            clientSocket.on('PutData', (message) => {
                putDataMessage = JSON.parse(message);
            });

            changeTurnAction.handle({
                client: mockedSocketGateway.clientSocket,
                type: c,
                entity: CombatTurnEnum.Player,
            });

            await new Promise<void>((resolve) => setTimeout(resolve, 15));

            expect(putDataMessage).toBeDefined();
            expect(putDataMessage.data).toBeDefined();
            expect(putDataMessage.data.message_type).toBe(c);
            expect(putDataMessage.data.action).toBe(SWARAction.ChangeTurn);
            expect(putDataMessage.data.data).toBe(CombatTurnEnum.Player);
        }
    });

    afterAll(async () => {
        await its.stop();
    });
});
