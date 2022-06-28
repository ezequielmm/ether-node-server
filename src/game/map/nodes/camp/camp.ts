import { ExpeditionMapNodeTypeEnum, ExpeditionStatusEnum } from 'src/game/components/expedition/expedition.enum';
import { Activity } from 'src/game/elements/prototypes/activity';
import { getApp } from 'src/main';

class Camp extends Node {
    constructor(
        id: number,
        act: number,
        step: number,
        type: ExpeditionMapNodeTypeEnum,
        subType: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        super(id, act, step, type, subType, private_data);
    }

    protected async rest(clientId: string) {
        const app = getApp();
        const expeditionService = await app.get('ExpeditionService');
        const gameManagerService = await app.get('GameManagerService');

        const expedition = await expeditionService.findOne({
            client_id: clientId,
        });

        const { hp_max, hp_current } = expedition.player_state;
        const new_hp = Math.max(hp_max, hp_current + hp_max * 0.3);

        await expeditionService.update(
            { client_id: clientId, status: ExpeditionStatusEnum.InProgress },
            {
                player_state: {
                    ...expedition.player_state,
                    hp_current: new_hp,
                },
            },
        );

        await gameManagerService.logActivity(
            clientId,
            new Activity('player_state', undefined, 'rest', undefined, [
                {
                    mod: 'set',
                    key: 'player_state.hp_current',
                    val: new_hp,
                },
            ]),
        );
    }
}

export default Camp;
