export enum SWARMessageType {
    MapUpdate = 'map_update',
    CombatUpdate = 'combat_update',
    PlayerStateUpdate = 'player_state_update',
    CardPlayed = 'card_played',
    UnplayableCard = 'unplayable_card',
    Error = 'error',
    EnemiesIntents = 'enemy_intents',
    GenericData = 'generic_data',
    EnemyAttacked = 'enemy_attacked',
    EndTurn = 'end_turn',
}

export enum SWARAction {
    ActivatePortal = 'activate_portal',
    ExtendMap = 'extend_map',
    BeginCombat = 'begin_combat',
    EndTurn = 'end_turn',
    ShowMap = 'show_map',
    UpdatePlayerState = 'update_player_state',
    MapUpdate = 'map_update',
    PlayCard = 'play_card',
    CardUnplayable = 'card_unplayable',
    InvalidCard = 'invalid_card',
    UnplayableCard = 'unplayable_card',
    UpdateEnemyIntents = 'update_enemy_intents',
    InvalidEnemy = 'invalid_enemy',
    InsufficientEnergy = 'insufficient_energy',
    UpdateEnergy = 'update_energy',
    MoveCard = 'move_card',
    UpdateEnemy = 'update_enemy',
}

interface SWARPayload {
    message_type: SWARMessageType;
    action: SWARAction | string;
    data: any;
}

interface SWARResponse {
    data: SWARPayload;
}

export class StandardResponse {
    static respond(payload: SWARPayload): SWARResponse {
        return { data: payload };
    }
}
