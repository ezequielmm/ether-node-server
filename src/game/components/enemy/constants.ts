import { mutantSpider1Data } from "./data/mutantSpider1.enemy";
import { mutantSpider2Data } from "./data/mutantSpider2.enemy";
import { swarmCocoon1Data } from "./data/swarmCocoon1.enemy";
import { swarmCocoon2Data } from "./data/swarmCocoon2.enemy";

export const ENEMY_DEFENSE_PATH = 'currentNode.data.enemies.$.defense';
export const ENEMY_SCRIPT_PATH = 'currentNode.data.enemies.$.currentScript';
export const ENEMY_HP_CURRENT_PATH = 'currentNode.data.enemies.$.hpCurrent';
export const ENEMY_CURRENT_SCRIPT_PATH = 'currentNode.data.enemies.$.currentScript';
export const ENEMY_CURRENT_COOLDOWN_PATH = 'currentNode.data.enemies.$.intentCooldowns';
export const ENEMY_STATUSES_PATH = 'currentNode.data.enemies.$.statuses';

export const ENEMY_SWARM_COCOON_IDS = [swarmCocoon1Data.enemyId, swarmCocoon2Data.enemyId];
export const ENEMY_MUTANT_SPIDERS_IDS = [mutantSpider1Data.enemyId, mutantSpider2Data.enemyId];