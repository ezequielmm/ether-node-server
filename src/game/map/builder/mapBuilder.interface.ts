import { NodeType } from '../../components/expedition/node-type';

export interface IActStepOption {
    key: string;
    probability: number;
    maxStepsInRange?: number;
    nodeConfig?: any;
}

export interface IActNodeFixedOption {
    type: NodeType;
    subType: NodeType;
    title: string;
    nodeConfig?: any;
}

export interface IActNodeOption extends IActNodeFixedOption {
    probability: number;
}

export interface IActConfiguration {
    actNumber: number;
    stepCount: number;
    maxNodesPerStep: number;

    stepRangeConfig: {
        [id: string]: {
            fixedNodes?: IActNodeFixedOption[];
            minNodes?: number;
            maxNodes?: number;
            nodeOptions?: IActStepOption[];
            funnel?: boolean;
            prevBoss?: boolean;
            boss?:boolean;
        };
    };

    // each node has to be /something/, so let's give each of the things it can be a name. That name refers to one or more specifi
    nodeOptions: {
        [id: string]: IActNodeOption[];
    };
}
