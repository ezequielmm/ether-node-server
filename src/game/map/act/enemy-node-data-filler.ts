import { shuffle, times } from 'lodash';
import { Node } from 'src/game/components/expedition/node';
import { NodeType } from 'src/game/components/expedition/node-type';
import { NodeConfig } from './act.builder';
import { NodeDataFiller } from './node-data-filler';

export interface EnemyNodeDataFillerConfig {
    enemies: number[];
    frequency: number;
}

export class EnemyNodeDataFiller implements NodeDataFiller {
    private readonly pool: Node['private_data']['enemies'] = [];

    protected getEnemies(): EnemyNodeDataFillerConfig[] {
        throw new Error('Not implemented');
    }

    constructor(private readonly length: number) {
        const enemies = this.getEnemies();
        this.pool = this.groupByPercentage(
            times(this.length),
            enemies.map(({ frequency }) => frequency),
        ).flatMap((group, index) =>
            times(group.length, () => ({
                enemies: enemies[index].enemies,
                probability: 1,
            })),
        );

        this.pool = shuffle(this.pool);
    }

    fill(config: NodeConfig): void {
        if (config.type != NodeType.Combat) throw new Error('Wrong node type');

        config.data = { enemies: [this.popRandom()] };
    }

    private popRandom = (): NodeConfig => this.pool.pop();

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
