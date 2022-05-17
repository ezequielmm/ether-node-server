import CombatBoss from './combat/combat.boss';
import CombatElite from './combat/combat.elite';
import CombatStandard from './combat/combat.standard';

import CampHouse from './camp/camp.house';
import CampRegular from './camp/camp.regular';

import Encounter from './encounter/encounter';
import Merchant from './merchant/merchant';
import Portal from './portal/portal';

import RoyalHouse from './royal_house/royal_house';
import RoyalHouseA from './royal_house/royal_house_a';
import RoyalHouseB from './royal_house/royal_house_b';
import RoyalHouseC from './royal_house/royal_house_c';
import RoyalHouseD from './royal_house/royal_house_d';

import Empty from './empty/empty';

function nodeFactory(
    id: number,
    act: number,
    step: number,
    type: string,
    private_data: any,
):
    | CombatBoss
    | CombatElite
    | CombatStandard
    | CampHouse
    | CampRegular
    | Encounter
    | Merchant
    | Portal
    | RoyalHouse
    | RoyalHouseA
    | RoyalHouseB
    | RoyalHouseC
    | RoyalHouseD
    | Empty {
    switch (type) {
        case 'combat_boss': {
            return new CombatBoss(id, act, step, type, private_data);
        }
        case 'combat_elite': {
            return new CombatElite(id, act, step, type, private_data);
        }
        case 'combat_standard': {
            return new CombatStandard(id, act, step, type, private_data);
        }
        case 'camp_house': {
            return new CampHouse(id, act, step, type, private_data);
        }
        case 'camp_regular': {
            return new CampRegular(id, act, step, type, private_data);
        }
        case 'encounter': {
            return new Encounter(id, act, step, type, private_data);
        }
        case 'merchant': {
            return new Merchant(id, act, step, type, private_data);
        }
        case 'portal': {
            return new Portal(id, act, step, type, private_data);
        }
        case 'royal_house': {
            return new RoyalHouse(id, act, step, type, private_data);
        }
        case 'royal_house_a': {
            return new RoyalHouseA(id, act, step, type, private_data);
        }
        case 'royal_house_b': {
            return new RoyalHouseB(id, act, step, type, private_data);
        }
        case 'royal_house_d': {
            return new RoyalHouseC(id, act, step, type, private_data);
        }
        case 'royal_house_c': {
            return new RoyalHouseD(id, act, step, type, private_data);
        }
        default:
            return new Empty(id, act, step, type, private_data);
    }
}

export default nodeFactory;
