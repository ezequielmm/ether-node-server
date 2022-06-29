import { actDefaults } from './act.config';

class Act {
    actConfig: any;
    actnumber: number;
    stepsTotal: number;
    minNodesPerStep: number;
    maxNodesPerStep: number;
    minExitPerNode: number;
    maxExitPerNode: number;
    stepDefault: any;
    stepConfig: any;
    constructor(actnumber: number, actConfigOptions: any) {
        this.actConfig = this.chooseActConfig(actnumber, actConfigOptions);
        this.actnumber = actnumber;
        this.stepsTotal = this.actConfig.steps
            ? this.actConfig.steps
            : actDefaults.stepsTotal;
        this.minNodesPerStep = this.actConfig.minNodesPerStep
            ? this.actConfig.minNodesPerStep
            : actDefaults.minNodesPerStep;
        this.maxNodesPerStep = this.actConfig.maxNodesPerStep
            ? this.actConfig.maxNodesPerStep
            : actDefaults.maxNodesPerStep;
        this.minExitPerNode = this.actConfig.minExitPerNode
            ? this.actConfig.minExitPerNode
            : actDefaults.minExitPerNode;
        this.maxExitPerNode = this.actConfig.maxExitPerNode
            ? this.actConfig.maxExitPerNode
            : actDefaults.maxExitPerNode;
        this.stepDefault = this.actConfig.step_defaults;
        this.stepConfig = this.actConfig.step_config;
    }

    private chooseActConfig(actnumber: number, actConfigOptions: any) {
        const matchingActConfigs = actConfigOptions.filter(
            (option: { act: number }) => option.act === actnumber,
        );
        const selectActConfigIndex = Math.floor(
            Math.random() * matchingActConfigs.length,
        );
        return matchingActConfigs[selectActConfigIndex];
    }

    private chooseNodeRange(nodes: number | any[]) {
        if (typeof nodes === 'number') return nodes;
        const chosenNodeIndex = Math.floor(Math.random() * nodes.length);
        return nodes[chosenNodeIndex];
    }

    chooseNode(nodeOptions: any[]) {
        const totalChance = nodeOptions.reduce(
            (prev, curr) => prev + curr.chance,
            0,
        );
        let options = nodeOptions;
        // Normalize chances to a total of 100%
        if (totalChance !== 100) {
            options = nodeOptions.map((option) => {
                const normalizedChance = option;
                normalizedChance.chance = (option.chance * 100) / totalChance;
                return normalizedChance;
            });
        }
        /* TO BE OPTIMIZED */
        const probabilityArray: any[] = [];
        options.forEach((node) => {
            for (let i = 0; i < node.chance; i += 1) {
                probabilityArray.push(node);
            }
        });
        return probabilityArray[Math.floor(Math.random() * 100)];
    }

    createNode(step: any) {
        const stepConfig = this.stepConfig[step];
        const stepOptions = stepConfig?.node_options
            ? stepConfig.node_options
            : this.stepDefault.node_options;
        return this.chooseNode(stepOptions);
    }

    createStep(stepnumber: number, stepConfig: any) {
        const step: any = {};
        step.stepnumber = stepnumber;
        const nodes = stepConfig?.nodes
            ? stepConfig.nodes
            : this.stepDefault.nodes;
        const stepOptions = stepConfig?.node_options
            ? stepConfig.node_options
            : this.stepDefault.node_options;
        step.nodeRange = this.chooseNodeRange(nodes);
        step.node = this.chooseNode(stepOptions);
        return step;
    }
}
export default Act;
