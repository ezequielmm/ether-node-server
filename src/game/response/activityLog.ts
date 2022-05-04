import { Activity } from '../elements/prototypes/activity';
import { ActivityBlock } from './activityBlock';
import { ActivityStep } from './activityStep';

export type BlockOptions = {
    placement?: string;
    blockRef?: string;
    merge?: {
        enabled?: boolean;
        mergeSteps?: boolean;
    };
};

const defaultBlockOptions: BlockOptions = {
    placement: 'append',
    merge: {
        enabled: false,
        mergeSteps: false,
    },
};

export type SerializeType = {
    activityLog: Activity[][];
};

export class ActivityLog {
    public blocks: ActivityBlock[];

    constructor() {
        this.blocks = [];
    }

    findBlockByName(name): ActivityBlock | undefined {
        return this.blocks.find((block) => block.name === name);
    }

    addBlock(
        block: ActivityBlock,
        options: BlockOptions = defaultBlockOptions,
    ): void {
        options = options || {};

        const oldBlock = this.findBlockByName(block.name);

        if (!oldBlock) {
            if (
                (options.placement === 'before' ||
                    options.placement === 'after') &&
                !options.blockRef
            ) {
                options.placement = 'append';
            }

            switch (options.placement) {
                case 'before':
                    this.blocks.splice(
                        this.blocks.indexOf(
                            this.findBlockByName(options.blockRef),
                        ),
                        0,
                        block,
                    );
                    break;
                case 'after':
                    this.blocks.splice(
                        this.blocks.indexOf(
                            this.findBlockByName(options.blockRef),
                        ) + 1,
                        0,
                        block,
                    );
                    break;
                case 'prepend':
                    this.blocks.unshift(block);
                    break;
                case 'append':
                default:
                    this.blocks.push(block);
                    break;
            }
        } else {
            if (!options.merge?.enabled) {
                throw `Block ${block.name} already exists, and merge is disabled.`;
            }

            if (!options.merge?.mergeSteps) {
                block.steps.forEach((step) => {
                    oldBlock.addStep(step);
                });
            } else {
                block.steps.forEach((step, i) => {
                    if (oldBlock.steps[i]) {
                        step.activities.forEach((activity) => {
                            oldBlock.steps[i].addActivity(activity);
                        });
                    } else {
                        oldBlock.addStep(step);
                    }
                });
            }
        }
    }

    newBlock(
        name: string,
        options: BlockOptions = defaultBlockOptions,
    ): ActivityBlock {
        const block = new ActivityBlock(name);
        this.addBlock(block, options);
        return block;
    }

    addStepToBlock(blockName: string, step: ActivityStep): void {
        const block = this.findBlockByName(blockName);
        if (!block) {
            throw new Error(`Block ${blockName} does not exist.`);
        }
        block.addStep(step);
    }

    addActivity(blockName: string, activity: Activity): void {
        let block = this.findBlockByName(blockName);
        if (!block) {
            block = this.newBlock(blockName);
        }

        if (!block.steps.length) {
            this.addStepToBlock(blockName, new ActivityStep());
        }

        block.steps[block.steps.length - 1].addActivity(activity);
    }

    serialize(): SerializeType {
        return {
            activityLog: this.blocks.flatMap((block) =>
                block.steps.map((step) => step.activities),
            ),
        };
    }

    clear(): void {
        this.blocks = [];
    }
}
