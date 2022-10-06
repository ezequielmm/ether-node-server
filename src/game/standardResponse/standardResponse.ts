export enum SWARMessageType {
    MapUpdate = 'map_update',
    CombatUpdate = 'combat_update',
    EndCombat = 'end_combat',
    PlayerStateUpdate = 'player_state_update',
    CardPlayed = 'card_played',
    Error = 'error',
    GenericData = 'generic_data',
    EnemyAffected = 'enemy_affected',
    PlayerAffected = 'player_affected',
    EndTurn = 'end_turn',
    BeginTurn = 'begin_turn',
    CampUpdate = 'camp_update',
    EncounterUpdate = 'encounter_update',
    TreasureUpdate = 'treasure_update',
    MerchantUpdate = 'merchant_update',
    EndNode = 'end_node',
}

export enum SWARAction {
    ActivatePortal = 'activate_portal',
    ExtendMap = 'extend_map',
    BeginCombat = 'begin_combat',
    EndTurn = 'end_turn',
    EnemiesDefeated = 'enemies_defeated',
    PlayerDefeated = 'players_defeated',
    SelectAnotherReward = 'select_another_reward',
    ShowMap = 'show_map',
    UpdatePlayerState = 'update_player_state',
    MapUpdate = 'map_update',
    InvalidCard = 'invalid_card',
    InsufficientEnergy = 'insufficient_energy',
    UpdateEnergy = 'update_energy',
    MoveCard = 'move_card',
    UpdateEnemy = 'update_enemy',
    UpdatePlayer = 'update_player',
    PlayerAffected = 'player_affected',
    ChangeTurn = 'change_turn',
    CombatQueue = 'combat_queue',
    BeginCamp = 'begin_camp',
    BeginEncounter = 'begin_encounter',
    BeginTreasure = 'begin_treasure',
    BeginMerchant = 'begin_merchant',
    ShowCardDialog = 'show_card_dialog',
    FinishCamp = 'finish_camp',
}

interface SWARPayload {
    message_type: SWARMessageType;
    seed?: number;
    action: SWARAction | string;
    data: any;
}

export class StandardResponse {
    static respond(payload: SWARPayload): string {
        return JSON.stringify({ data: payload });
    }
}
