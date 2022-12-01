export enum SWARMessageType {
    MapUpdate = 'map_update',
    CombatUpdate = 'combat_update',
    EndTreasure = 'end_treasure',
    EndCombat = 'end_combat',
    SelectReward = 'select_reward',
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
    PotionNotUsableOutsideCombat = 'potion_not_usable_outside_combat',
    PotionNotInInventory = 'potion_not_in_inventory',
    PotionNotFoundInDatabase = 'potion_not_found_in_database',
    PotionMaxCountReached = 'potion_max_count_reached',
    PurchaseSuccess = 'purchase_success',
    CardUpgrade = 'card_upgrade',
    CardUpdated = 'card_updated',
    UsePotion = 'use_potion',
    AddPotion = 'add_potion',
    AddTrinket = 'add_trinket',
    CardDestroy = 'card_destroy',
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
    AddCard = 'add_card',
    MoveCard = 'move_card',
    UpdateCardDescription = 'update_card_description',
    UpdateEnemy = 'update_enemy',
    UpdatePlayer = 'update_player',
    PlayerAffected = 'player_affected',
    ChangeTurn = 'change_turn',
    CombatQueue = 'combat_queue',
    BeginCamp = 'begin_camp',
    BeginEncounter = 'begin_encounter',
    ContinueEncounter = 'continue_encounter',
    BeginTreasure = 'begin_treasure',
    ContinueTreasure = 'continue_treasure',
    TreasureData = 'treasure_data',
    BeginMerchant = 'begin_merchant',
    ShowCardDialog = 'show_card_dialog',
    ShowInvalidPotion = 'show_invalid_potion',
    FinishCamp = 'finish_camp',
    MerchantUpdate = 'merchant_update',
    MerchantData = 'merchant_data',
    PurchaseSuccess = 'purchase_success',
    PurchaseFailure = 'purchase_failure',
    UpgradablePair = 'upgradable_pair',
    ConfirmUpgrade = 'confirm_upgrade',
    PotionNotUsableOutsideCombat = 'potion_not_usable_outside_combat',
    PotionNotInInventory = 'potion_not_in_inventory',
    PotionNotFoundInDatabase = 'potion_not_found_in_database',
    PotionMaxCountReached = 'potion_max_count_reached',
    TrinketNotFoundInDatabase = 'trinket_not_found_in_database',
    ChestResult = 'chest_result',
    HealAmount = 'heal_amount',
    CardUpgrade = 'card_upgrade',
    CardDestroy = 'card_destroy',
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
