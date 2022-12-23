import { shuffle, times } from 'lodash';
import { NodeType } from 'src/game/components/expedition/node-type';
import { NodeConfig } from './act.builder';

export interface NodeTypeFrequency {
    frequency: number;
    node: {
        type: NodeType;
        subType: NodeType;
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
                type: NodeType.Merchant,
                subType: NodeType.Merchant,
            },
        },
        {
            frequency: 12,
            node: {
                type: NodeType.Camp,
                subType: NodeType.CampRegular,
            },
        },
        {
            frequency: 15,
            node: {
                type: NodeType.Treasure,
                subType: NodeType.Treasure,
            },
        },
        {
            frequency: 8,
            node: {
                type: NodeType.Combat,
                subType: NodeType.CombatElite,
            },
        },
        {
            frequency: 10,
            node: {
                type: NodeType.Encounter,
                subType: NodeType.Encounter,
            },
        },
        {
            frequency: 50,
            node: {
                type: NodeType.Combat,
                subType: NodeType.CombatStandard,
            },
        },
    ];

    private readonly pool: NodeConfig[] = [];

    constructor(private readonly length: number) {
        this.pool = this.groupByPercentage(
            times(this.length),
            this.types.map(({ frequency }) => frequency),
        ).flatMap((group, index) =>
            times(group.length, () => this.types[index].node),
        );

        this.pool = shuffle(this.pool);
    }

    popRandom = (): NodeConfig => this.pool.pop();

    private groupByPercentage<T>(array: T[], percentages: number[]): T[][] {
        // Get percentage for 1 node type:
        const unit = 100 / array.length;
        // Sort percentages by decreasing remainder (modulo unit)
        //   and get number of units covered by each percentage
        const sorted = percentages
            .map((p, i) => [i, Math.floor(p / unit), p % unit])
            .sort((a, b) => b[2] - a[2]);
        // Get how many units are not yet distributed:
        const remain =
            array.length - sorted.reduce((sum, a) => (sum += a[1]), 0);
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
