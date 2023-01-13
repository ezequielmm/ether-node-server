import { NodeConfig } from './act.builder';

export interface NodeDataFiller {
    fill(config: NodeConfig, step: number): void;
}
