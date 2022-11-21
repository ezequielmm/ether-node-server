import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import * as _ from 'lodash';
import { NodeConfig } from './act.builder';

export interface NodeTypeFrequency {
    frequency: number;
    node: {
        type: ExpeditionMapNodeTypeEnum;
        subType: ExpeditionMapNodeTypeEnum;
    };
}

export class NodeTypePool {
    /**
     * Types of nodes that can be generated
     *
     * @see {@link https://robotseamonster.atlassian.net/wiki/spaces/KOTE/pages/15204365/Map+Structure+Node+Overview}
     */
    private readonly types: NodeTypeFrequency[] = [
        {
            frequency: 5,
            node: {
                type: ExpeditionMapNodeTypeEnum.Merchant,
                subType: ExpeditionMapNodeTypeEnum.Merchant,
            },
        },
        {
            frequency: 12,
            node: {
                type: ExpeditionMapNodeTypeEnum.Camp,
                subType: ExpeditionMapNodeTypeEnum.CampRegular,
            },
        },
        {
            frequency: 15,
            node: {
                type: ExpeditionMapNodeTypeEnum.Treasure,
                subType: ExpeditionMapNodeTypeEnum.Treasure,
            },
        },
        {
            frequency: 8,
            node: {
                type: ExpeditionMapNodeTypeEnum.Combat,
                subType: ExpeditionMapNodeTypeEnum.CombatElite,
            },
        },
        {
            frequency: 60,
            node: {
                type: ExpeditionMapNodeTypeEnum.Combat,
                subType: ExpeditionMapNodeTypeEnum.CombatStandard,
            },
        },
    ];

    private readonly pool: NodeConfig[] = [];

    constructor(private readonly length: number) {
        this.pool = this.groupByPercentage(
            _.times(this.length),
            this.types.map(({ frequency }) => frequency),
        ).flatMap((group, index) =>
            _.times(group.length, () => this.types[index].node),
        );

        this.pool = _.shuffle(this.pool);
    }

    popRandom(): NodeConfig {
        return this.pool.pop();
    }

    private groupByPercentage<T>(array: T[], percentages: number[]): T[][] {
        // Get percentage for 1 node type:
        let unit = 100 / array.length;
        // Sort percentages by decreasing remainder (modulo unit)
        //   and get number of units covered by each percentage
        let sorted = percentages
            .map((p, i) => [i, Math.floor(p / unit), p % unit])
            .sort((a, b) => b[2] - a[2]);
        // Get how many units are not yet distributed:
        let remain = array.length - sorted.reduce((sum, a) => (sum += a[1]), 0);
        // Distribute those, giving priority to groups where the remainders are greatest
        for (let i = 0; i < remain; i++) sorted[i][1]++;
        // Build and return the chunks by filling the groups in their
        //    original order
        let i = 0;
        return sorted
            .sort((a, b) => a[0] - b[0])
            .map((a) => array.slice(i, (i += a[1])));
    }
}
