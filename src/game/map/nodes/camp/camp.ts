import {
    ExpeditionMapNodeTypeEnum,
    ExpeditionStatusEnum,
} from 'src/game/components/expedition/expedition.enum';
import { getApp } from 'src/main';
import Node from '../node';

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
    }
}

export default Camp;
