import { IntegrationTestServer } from 'src/tests/integrationTestServer';
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
        });
        changeTurnAction = its.getInjectable(ChangeTurnAction);
        mockedSocketGateway = its.getInjectable(ServerSocketGatewayMock);
    });

    it('handle change turn action', async () => {
        const [clientSocket, messages] = await its.addNewSocketConnection();
        const cases: (SWARMessageType.BeginTurn | SWARMessageType.EndTurn)[] = [
            SWARMessageType.EndTurn,
            SWARMessageType.BeginTurn,
        ];

        for (const c of cases) {
            await changeTurnAction.handle({
                client: mockedSocketGateway.clientSocket,
                type: c,
                entity: CombatTurnEnum.Player,
            });
        }

        await clientSocket.waitMessages(messages, 2);
        expect(messages).toHaveLength(2);

        cases.forEach((c, i) => {
            const message = messages[i];
            expect(message).toBeDefined();
            expect(message.data).toBeDefined();
            expect(message.data.message_type).toBe(c);
            expect(message.data.action).toBe(SWARAction.ChangeTurn);
            expect(message.data.data).toBe(CombatTurnEnum.Player);
        });
    });

    afterAll(async () => {
        await its.stop();
    });
});
