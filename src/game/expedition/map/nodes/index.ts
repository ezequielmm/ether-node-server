import Combat from "./combat/combat";
import CombatBoss from "./combat/combat.boss";
import CombatElite from "./combat/combat.elite";
import CombatStandard from "./combat/combat.standard";

import Camp from "./camp/camp";
import CampHouse from "./camp/camp.house";
import CampRegular from "./camp/camp.regular";

import Encounter from "./encounter/encounter";
import Merchant from "./merchant/merchant";

function nodeFactory(nodeOptions: { type: string; config: any }) {
  const { type, config } = nodeOptions;
  switch (type) {
    case "combat": {
      const combat = new Combat();
      combat.stateInitialize(config);
      return combat;
    }
    case "combat_boss": {
      const combatBoss = new CombatBoss();
      combatBoss.stateInitialize(config);
      return combatBoss;
    }
    case "combat_elite": {
      const combatElite = new CombatElite();
      combatElite.stateInitialize(config);
      return combatElite;
    }
    case "combat_standard": {
      const combatStandard = new CombatStandard();
      combatStandard.stateInitialize(config);
      return combatStandard;
    }
    case "camp": {
      const camp = new Camp();
      camp.stateInitialize(config);
      return camp;
    }
    case "camp_house": {
      const campHouse = new CampHouse();
      campHouse.stateInitialize();
      return campHouse;
    }
    case "camp_regular": {
      const campRegular = new CampRegular();
      campRegular.stateInitialize(config);
      return campRegular;
    }
    case "encounter": {
      const encounter = new Encounter();
      encounter.stateInitialize(config);
      return encounter;
    }
    case "merchant": {
      const merchant = new Merchant();
      merchant.stateInitialize();
      return merchant;
    }
    default:
      return "something";
  }
}

export default nodeFactory;
