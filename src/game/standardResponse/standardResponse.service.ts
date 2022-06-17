import { Injectable } from '@nestjs/common';

export enum SWARMessageType {
    MapUpdate = 'map_update',
    CombatUpdate = 'combat_update',
    PlayerStateUpdate = 'player_state_update',
    CardPlayed = 'card_played',
    UnplayableCard = 'unplayable_card',
    Error = 'error',
}

export enum SWARAction {
    ActivatePortal = 'activate_portal',
    ExtendMap = 'extend_map',
    BeginCombat = 'begin_combat',
    ShowMap = 'show_map',
    UpdatePlayerState = 'update_player_state',
    MapUpdate = 'map_update',
    PlayCard = 'play_card',
    CardUnplayable = 'card_unplayable',
    InvalidCard = 'invalid_card',
    UnplayableCard = 'unplayable_card',
}

interface SWARPayload {
    message_type: SWARMessageType;
    action: SWARAction;
    data: any;
}

interface SWARResponse {
    data: SWARPayload;
}

@Injectable()
export class StandardResponseService {
    createResponse(payload: SWARPayload): SWARResponse {
        return { data: payload };
    }
}
