import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import Camp from './camp/camp';
import CampHouse from './camp/camp.house';
import CampRegular from './camp/camp.regular';
import Combat from './combat/combat';
import CombatBoss from './combat/combat.boss';
import CombatElite from './combat/combat.elite';
import CombatStandard from './combat/combat.standard';
import Empty from './empty/empty';
import Encounter from './encounter/encounter';
import Merchant from './merchant/merchant';
import Portal from './portal/portal';
import RoyalHouse from './royalHouse/royalHouse';
import RoyalHouseA from './royalHouse/royalHouse_a';
import RoyalHouseB from './royalHouse/royalHouse_b';
import RoyalHouseC from './royalHouse/royalHouse_c';
import RoyalHouseD from './royalHouse/royalHouse_d';
import Treasure from './treasure/treasure';
import Event from './event/event';

function nodeFactory(
    id: number,
    act: number,
    step: number,
    type: ExpeditionMapNodeTypeEnum,
    subType: ExpeditionMapNodeTypeEnum,
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
    switch (subType) {
        case ExpeditionMapNodeTypeEnum.Combat:
            return new Combat(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.CombatBoss:
            return new CombatBoss(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.CombatElite:
            return new CombatElite(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.CombatStandard:
            return new CombatStandard(
                id,
                act,
                step,
                type,
                subType,
                private_data,
            );

        case ExpeditionMapNodeTypeEnum.Camp:
            return new Camp(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.CampHouse:
            return new CampHouse(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.CampRegular:
            return new CampRegular(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.Encounter:
            return new Encounter(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.Merchant:
            return new Merchant(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.Portal:
            return new Portal(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.RoyalHouse:
            return new RoyalHouse(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.RoyalHouseA:
            return new RoyalHouseA(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.RoyalHouseB:
            return new RoyalHouseB(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.RoyalHouseC:
            return new RoyalHouseC(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.RoyalHouseD:
            return new RoyalHouseD(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.Event:
            return new Event(id, act, step, type, subType, private_data);

        case ExpeditionMapNodeTypeEnum.Treasure:
            return new Treasure(id, act, step, type, subType, private_data);

        default:
            return new Empty(id, act, step, type, subType, private_data);
    }
}

export default nodeFactory;
