import { Injectable } from '@nestjs/common';

export enum SWARMessageType {
    MapUpdate = 'map_update',
    CombatUpdate = 'combat_update',
    PlayerStateUpdate = 'player_state_update',
}

export enum SWARAction {
    ActivatePortal = 'activate_portal',
    ExtendMap = 'extend_map',
    BeginCombat = 'begin_combat',
    ShowMap = 'show_map',
    UpdatePlayerState = 'update_player_state',
    MapUpdate = 'map_update',
}

interface SWARPayload {
    message_type: SWARMessageType;
    action: SWARAction;
    data: any;
}

interface SWARResponse {
    data: {
        message_type: SWARMessageType;
        action: SWARAction;
        data: any;
    };
}

@Injectable()
export class StandardResponseService {
    createResponse(payload: SWARPayload): SWARResponse {
        return { data: payload };
    }
}
