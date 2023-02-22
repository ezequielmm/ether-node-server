import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from './standardResponse';

describe('Standard Response Generator', () => {
    it('should create a new reponse', () => {
        const result = StandardResponse.respond({
            message_type: SWARMessageType.BeginTurn,
            action: SWARAction.ChangeTurn,
            data: CombatTurnEnum.Player,
        });

        expect(typeof result).toEqual('string');
    });
});
