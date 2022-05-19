import { ExpeditionMapNodeTypeEnum } from '../../enums';

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
    type: ExpeditionMapNodeTypeEnum,
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
        case ExpeditionMapNodeTypeEnum.CombatBoss: {
            return new CombatBoss(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.CombatElite: {
            return new CombatElite(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.CombatStandard: {
            return new CombatStandard(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.CampHouse: {
            return new CampHouse(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.CampRegular: {
            return new CampRegular(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.Encounter: {
            return new Encounter(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.Merchant: {
            return new Merchant(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.Portal: {
            return new Portal(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.RoyalHouse: {
            return new RoyalHouse(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.RoyalHouseA: {
            return new RoyalHouseA(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.RoyalHouseB: {
            return new RoyalHouseB({ id, act, step, type, private_data });
        }
        case ExpeditionMapNodeTypeEnum.RoyalHouseC: {
            return new RoyalHouseC(id, act, step, type, private_data);
        }
        case ExpeditionMapNodeTypeEnum.RoyalHouseD: {
            return new RoyalHouseD(id, act, step, type, private_data);
        }
        default:
            return new Empty(id, act, step, type, private_data);
    }
}

export default nodeFactory;
