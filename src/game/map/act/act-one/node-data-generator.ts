import { cloneDeep } from 'lodash';
import { ancientOneData } from 'src/game/components/enemy/data/ancientOne.enemy';
import { barkChargerData } from 'src/game/components/enemy/data/barkCharger.enemy';
import { groundMothData } from 'src/game/components/enemy/data/groundmoth.enemy';
import { mimicFrog1Data } from 'src/game/components/enemy/data/mimicFrog1.enemy';
import { queenOrchidData } from 'src/game/components/enemy/data/queenOrchid.enemy';
import { sporeMongerData } from 'src/game/components/enemy/data/sporeMonger.enemy';
import { stingFaeData } from 'src/game/components/enemy/data/stingFae.enemy';
import { swampGoblin1Data } from 'src/game/components/enemy/data/swampGoblin1.enemy';
import { swampGoblin2Data } from 'src/game/components/enemy/data/swampGoblin2.enemy';
import { thornWolfData } from 'src/game/components/enemy/data/thornWolf.enemy';
import { trapelicanData } from 'src/game/components/enemy/data/trapelican.enemy';
import { NodeType } from 'src/game/components/expedition/node-type';
import { NodeConfig } from '../act.builder';
import { NodeDataFiller } from '../node-data-filler';

const eliteNodeData = {
    enemies: [
        {
            enemies: [thornWolfData.enemyId],
            probability: 33.3,
        },
        {
            enemies: [queenOrchidData.enemyId],
            probability: 33.3,
        },
        {
            enemies: [ancientOneData.enemyId],
            probability: 33.3,
        },
    ],
};

const easyCombatStandarData = {
    enemies: [
        {
            enemies: [mimicFrog1Data.enemyId, mimicFrog1Data.enemyId], // TODO: Mimic Frog 2
            probability: 0.12,
        },
        {
            enemies: [groundMothData.enemyId],
            probability: 0.11,
        },
        {
            enemies: [
                stingFaeData.enemyId,
                stingFaeData.enemyId,
                swampGoblin1Data.enemyId,
            ],
            probability: 0.11,
        },
        {
            enemies: [
                barkChargerData.enemyId,
                barkChargerData.enemyId,
                barkChargerData.enemyId,
            ],
            probability: 0.1,
        },
        {
            enemies: [
                swampGoblin2Data.enemyId,
                swampGoblin2Data.enemyId,
                swampGoblin1Data.enemyId,
            ],
            probability: 0.1,
        },
        {
            enemies: [sporeMongerData.enemyId, trapelicanData.enemyId],
            probability: 0.1,
        },
        {
            enemies: [trapelicanData.enemyId, mimicFrog1Data.enemyId],
            probability: 0.1,
        },
        {
            enemies: [barkChargerData.enemyId, swampGoblin2Data.enemyId],
            probability: 0.09,
        },
        {
            enemies: [
                stingFaeData.enemyId,
                stingFaeData.enemyId,
                stingFaeData.enemyId,
                stingFaeData.enemyId,
            ],
            probability: 0.09,
        },
        {
            enemies: [
                stingFaeData.enemyId,
                groundMothData.enemyId,
                stingFaeData.enemyId,
            ],
            probability: 0.08,
        },
    ],
};

const hardCombatStandarData = {
    enemies: [
        {
            enemies: [
                mimicFrog1Data.enemyId,
                mimicFrog1Data.enemyId,
                sporeMongerData.enemyId,
            ],
            probability: 0.12,
        },
        {
            enemies: [groundMothData.enemyId, sporeMongerData.enemyId],
            probability: 0.11,
        },
        {
            enemies: [
                barkChargerData.enemyId,
                barkChargerData.enemyId,
                stingFaeData.enemyId,
                stingFaeData.enemyId,
            ],
            probability: 0.11,
        },
        {
            enemies: [
                stingFaeData.enemyId,
                stingFaeData.enemyId,
                swampGoblin1Data.enemyId,
                swampGoblin2Data.enemyId,
            ],
            probability: 0.1,
        },
        {
            enemies: [
                swampGoblin2Data.enemyId,
                swampGoblin2Data.enemyId,
                swampGoblin1Data.enemyId,
                swampGoblin1Data.enemyId,
            ],
            probability: 0.1,
        },
        {
            enemies: [
                sporeMongerData.enemyId,
                sporeMongerData.enemyId,
                trapelicanData.enemyId,
            ],
            probability: 0.1,
        },
        {
            enemies: [
                trapelicanData.enemyId,
                trapelicanData.enemyId,
                mimicFrog1Data.enemyId,
            ],
            probability: 0.1,
        },
        {
            enemies: [
                barkChargerData.enemyId,
                barkChargerData.enemyId,
                swampGoblin2Data.enemyId,
            ],
            probability: 0.09,
        },
        {
            enemies: [
                stingFaeData.enemyId,
                stingFaeData.enemyId,
                stingFaeData.enemyId,
                stingFaeData.enemyId,
                stingFaeData.enemyId,
            ],
            probability: 0.09,
        },
        {
            enemies: [groundMothData.enemyId, groundMothData.enemyId],
            probability: 0.08,
        },
    ],
};

export class ActOneNodeDataFiller implements NodeDataFiller {
    fill(config: NodeConfig, step: number): void {
        if (config.type != NodeType.Combat) {
            return;
        }

        if (config.subType == NodeType.CombatElite) {
            config.data = cloneDeep(eliteNodeData);
        }

        if (config.subType == NodeType.CombatStandard) {
            if (step <= 12) {
                config.data = cloneDeep(easyCombatStandarData);
            } else {
                config.data = cloneDeep(hardCombatStandarData);
            }
        }
    }
}
