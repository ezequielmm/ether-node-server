import { ActivityLog } from './activityLog';
import { ActivityBlock } from './activityBlock';
import { ActivityStep } from './activityStep';
import { Activity } from '../elements/prototypes/activity';

const activities: Activity[] = [
    new Activity('ElementType', 1, 'damageReceived', { value: 5 }, [
        {
            mod: 'add',
            key: 'enemy.1.hp_current',
            val: 5,
        },
    ]),
    new Activity('ElementType', 1, 'damageReceived', { value: 7 }, [
        {
            mod: 'add',
            key: 'enemy.1.hp_current',
            val: 5,
        },
    ]),
    new Activity('ElementType', 1, 'damageReceived', { value: 3 }, [
        {
            mod: 'add',
            key: 'enemy.1.hp_current',
            val: 5,
        },
    ]),
];

describe('ActivityLog', () => {
    describe('findBlockByName', () => {
        it('should return the block with the given name', () => {
            const activityLog = new ActivityLog();
            const activityBlock = new ActivityBlock('test');

            activityLog.addBlock(activityBlock);

            expect(activityLog.findBlockByName('test')).toBe(activityBlock);
        });
    });

    describe('addBlock', () => {
        it('should add a block to the activity log', () => {
            const activityLog = new ActivityLog();
            const activityBlock = new ActivityBlock('test');

            activityLog.addBlock(activityBlock);

            expect(activityLog.blocks.length).toBe(1);
        });
        it('Should throw error adding activity log with duplicate name', () => {
            const activityLog = new ActivityLog();
            const activityBlock1 = new ActivityBlock('test');
            const activityBlock2 = new ActivityBlock('test');

            activityLog.addBlock(activityBlock1);
            expect(() => activityLog.addBlock(activityBlock2)).toThrow(
                `Block ${activityBlock2.name} already exists, and merge is disabled.`,
            );
        });

        it("should add a block to the activity log with placement 'append'", () => {
            const activityLog = new ActivityLog();
            const activityBlock1 = new ActivityBlock('test1');
            const activityBlock2 = new ActivityBlock('test2');
            activityLog.addBlock(activityBlock1);
            activityLog.addBlock(activityBlock2, {
                placement: 'append',
            });
            expect(activityLog.blocks.length).toBe(2);
            expect(activityLog.blocks[0]).toBe(activityBlock1);
            expect(activityLog.blocks[1]).toBe(activityBlock2);
        });
        it("should add a block to the activity log with placement 'prepend'", () => {
            const activityLog = new ActivityLog();
            const activityBlock1 = new ActivityBlock('test1');
            const activityBlock2 = new ActivityBlock('test2');
            activityLog.addBlock(activityBlock1);
            activityLog.addBlock(activityBlock2, {
                placement: 'prepend',
            });
            expect(activityLog.blocks.length).toBe(2);
            expect(activityLog.blocks[0]).toBe(activityBlock2);
            expect(activityLog.blocks[1]).toBe(activityBlock1);
        });
        it("Should add a block to the activity log with placement 'before'", () => {
            const activityLog = new ActivityLog();
            const activityBlock1 = new ActivityBlock('test1');
            const activityBlock2 = new ActivityBlock('test2');
            const activityBlock3 = new ActivityBlock('test3');
            activityLog.addBlock(activityBlock1);
            activityLog.addBlock(activityBlock3);
            activityLog.addBlock(activityBlock2, {
                placement: 'before',
                block_ref: 'test1',
            });
            expect(activityLog.blocks.length).toBe(3);
            expect(activityLog.blocks[0]).toBe(activityBlock2);
            expect(activityLog.blocks[1]).toBe(activityBlock1);
            expect(activityLog.blocks[2]).toBe(activityBlock3);
        });

        it("Should add a block to the activity log with placement 'after'", () => {
            const activityLog = new ActivityLog();
            const activityBlock1 = new ActivityBlock('test1');
            const activityBlock2 = new ActivityBlock('test2');
            const activityBlock3 = new ActivityBlock('test3');
            activityLog.addBlock(activityBlock1);
            activityLog.addBlock(activityBlock3);
            activityLog.addBlock(activityBlock2, {
                placement: 'after',
                block_ref: 'test1',
            });
            expect(activityLog.blocks.length).toBe(3);
            expect(activityLog.blocks[0]).toBe(activityBlock1);
            expect(activityLog.blocks[1]).toBe(activityBlock2);
            expect(activityLog.blocks[2]).toBe(activityBlock3);
        });

        it('Should merge blocks with the same name', () => {
            const activityLog = new ActivityLog();
            const activityBlock1 = new ActivityBlock('test1');
            const activiyStep1 = new ActivityStep();
            activiyStep1.addActivity(activities[0]);
            activiyStep1.addActivity(activities[1]);
            activityBlock1.addStep(activiyStep1);
            const activityBlock2 = new ActivityBlock('test1');
            const activiyStep2 = new ActivityStep();
            activiyStep2.addActivity(activities[2]);
            activityBlock2.addStep(activiyStep2);

            activityLog.addBlock(activityBlock1);
            activityLog.addBlock(activityBlock2, {
                merge: {
                    enabled: true,
                },
            });

            expect(activityLog.blocks.length).toBe(1);
            expect(activityLog.blocks[0].steps.length).toBe(2);
            expect(activityLog.blocks[0].steps[0].activities.length).toBe(2);
            expect(activityLog.blocks[0].steps[1].activities.length).toBe(1);
        });
        it('Should merge blocks with the same name: mergeSteps', () => {
            const activityLog = new ActivityLog();
            const activityBlock1 = new ActivityBlock('test1');
            const activiyStep1 = new ActivityStep();
            activiyStep1.addActivity(activities[0]);
            activiyStep1.addActivity(activities[1]);
            activityBlock1.addStep(activiyStep1);
            const activityBlock2 = new ActivityBlock('test1');
            const activiyStep2 = new ActivityStep();
            activiyStep2.addActivity(activities[2]);
            activityBlock2.addStep(activiyStep2);

            activityLog.addBlock(activityBlock1);
            activityLog.addBlock(activityBlock2, {
                merge: {
                    enabled: true,
                    merge_steps: true,
                },
            });

            expect(activityLog.blocks.length).toBe(1);
            expect(activityLog.blocks[0].steps.length).toBe(1);
            expect(activityLog.blocks[0].steps[0].activities.length).toBe(3);
            expect(activityLog.blocks[0].steps[0].activities[0]).toBe(
                activities[0],
            );
            expect(activityLog.blocks[0].steps[0].activities[1]).toBe(
                activities[1],
            );
            expect(activityLog.blocks[0].steps[0].activities[2]).toBe(
                activities[2],
            );
        });
    });

    describe('newBlock', () => {
        it('should create a new block with the given name', () => {
            const activityLog = new ActivityLog();
            const activityBlock = activityLog.newBlock('test');

            expect(activityBlock.name).toBe('test');
            expect(activityLog.blocks[0]).toBe(activityBlock);
        });
    });

    describe('addStepToBlock', () => {
        it('should add a step to the given block', () => {
            const activityLog = new ActivityLog();
            const activityBlock = new ActivityBlock('test');
            const activityStep = new ActivityStep();
            activityStep.addActivity(activities[0]);
            activityStep.addActivity(activities[1]);
            activityLog.addBlock(activityBlock);
            activityLog.addStepToBlock('test', activityStep);

            expect(activityBlock.steps.length).toBe(1);
            expect(activityBlock.steps[0]).toBe(activityStep);
        });
    });

    describe('addActivity', () => {
        it('should add an activity to the given block', () => {
            const activityLog = new ActivityLog();
            const activityBlock = new ActivityBlock('test');
            const activityStep = new ActivityStep();
            activityStep.addActivity(activities[0]);
            activityStep.addActivity(activities[1]);
            activityBlock.addStep(activityStep);
            activityLog.addBlock(activityBlock);
            activityLog.addActivity('test', activities[2]);

            expect(activityBlock.steps.length).toBe(1);
            expect(activityBlock.steps[0]).toBe(activityStep);
            expect(activityBlock.steps[0].activities.length).toBe(3);
            expect(activityBlock.steps[0].activities[0]).toBe(activities[0]);
            expect(activityBlock.steps[0].activities[1]).toBe(activities[1]);
            expect(activityBlock.steps[0].activities[2]).toBe(activities[2]);
        });
        it('should add an activity to the given block (Steps empty)', () => {
            const activityLog = new ActivityLog();
            const activityBlock = new ActivityBlock('test');

            activityLog.addBlock(activityBlock);
            activityLog.addActivity('test', activities[0]);

            expect(activityBlock.steps.length).toBe(1);
            expect(activityBlock.steps[0].activities.length).toBe(1);
            expect(activityBlock.steps[0].activities[0]).toBe(activities[0]);
        });
    });

    describe('serialize', () => {
        it('should serialize the activity log', () => {
            const activityLog = new ActivityLog();
            const activityBlock1 = new ActivityBlock('test1');
            const activityBlock2 = new ActivityBlock('test2');
            const activityStep1 = new ActivityStep();
            const activityStep2 = new ActivityStep();
            activityStep1.addActivity(activities[0]);
            activityStep1.addActivity(activities[1]);
            activityBlock1.addStep(activityStep1);
            activityStep2.addActivity(activities[2]);
            activityBlock2.addStep(activityStep2);
            activityLog.addBlock(activityBlock1);
            activityLog.addBlock(activityBlock2);

            const serialized = activityLog.serialize();

            expect(serialized).toStrictEqual({
                activity_log: [
                    { activities: [activities[0], activities[1]] },
                    { activities: [activities[2]] },
                ],
            });
        });
    });

    describe('clear', () => {
        it('should clear the activity log', () => {
            const activityLog = new ActivityLog();
            const activityBlock = new ActivityBlock('test');
            const activityStep = new ActivityStep();
            activityStep.addActivity(activities[0]);
            activityStep.addActivity(activities[1]);
            activityBlock.addStep(activityStep);
            activityLog.addBlock(activityBlock);
            activityLog.addActivity('test', activities[2]);
            activityLog.clear();

            expect(activityLog.blocks.length).toBe(0);
        });
    });
});
