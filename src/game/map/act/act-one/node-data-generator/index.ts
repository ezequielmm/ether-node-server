import { filter, inRange } from 'lodash';
import { Node } from 'src/game/components/expedition/node';
import { NodeType } from 'src/game/components/expedition/node-type';
import { NodeConfig } from '../../act.builder';
import { NodeDataFiller } from '../../node-data-filler';
import { InitialEnemiesFiller } from './initial-enemies-filler';
import { EasyEnemiesFiller } from './easy-enemies-filler';
import { EliteEnemiesFiller } from './elite-enemies-filler';
import { HardEnemiesFiller } from './hard-enemies-filler';

export class ActOneNodeDataFiller implements NodeDataFiller {
    private readonly initialEnemiesFiller: InitialEnemiesFiller;
    private readonly easyEnemiesFiller: EasyEnemiesFiller;
    private readonly hardEnemiesFiller: HardEnemiesFiller;
    private readonly eliteEnemiesFiller: EliteEnemiesFiller;

    constructor(private readonly nodes: Node[]) {
        const combatNodes = filter(this.nodes, {
            type: NodeType.Combat,
            subType: NodeType.CombatStandard,
            private_data: undefined,
        });

        const eliteCombatNodes = filter(this.nodes, {
            type: NodeType.Combat,
            subType: NodeType.CombatElite,
            private_data: undefined,
        });

        const initialCombatNodes = filter(combatNodes, (node) =>
            inRange(node.step, 0, 3),
        );
        const easyCombatNodes = filter(combatNodes, (node) =>
            inRange(node.step, 3, 13),
        );
        const hardCombatNodes = filter(combatNodes, (node) =>
            inRange(node.step, 13, Number.POSITIVE_INFINITY),
        );

        this.initialEnemiesFiller = new InitialEnemiesFiller(
            initialCombatNodes.length,
        );
        this.easyEnemiesFiller = new EasyEnemiesFiller(easyCombatNodes.length);
        this.hardEnemiesFiller = new HardEnemiesFiller(hardCombatNodes.length);
        this.eliteEnemiesFiller = new EliteEnemiesFiller(
            eliteCombatNodes.length,
        );
    }

    fill(config: NodeConfig, step: number): void {
        if (config.type !== NodeType.Combat) {
            return;
        }

        if (config.subType === NodeType.CombatStandard) {
            if (inRange(step, 0, 3)) {
                this.initialEnemiesFiller.fill(config);
            } else if (inRange(step, 3, 13)) {
                this.easyEnemiesFiller.fill(config);
            } else if (inRange(step, 13, Number.POSITIVE_INFINITY)) {
                this.hardEnemiesFiller.fill(config);
            }
        } else if (config.subType === NodeType.CombatElite) {
            this.eliteEnemiesFiller.fill(config);
        }
    }
}
