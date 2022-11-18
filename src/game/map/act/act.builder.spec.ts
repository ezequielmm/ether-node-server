import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import { DefaultActBuilder } from './act.builder';
import { ActBuilder } from './act.builder';

describe('ActBuilder', () => {
    let actBuilder: ActBuilder;

    beforeEach(() => {
        actBuilder = new DefaultActBuilder(1);
    });

    describe('addStep', () => {
        it('should add step', () => {
            expect(actBuilder['currentStep']).toBe(-1);
            actBuilder.addStep(() => {});
            expect(actBuilder['currentStep']).toBe(0);
        });
    });

    describe('addRandgeOfSteps', () => {
        it('should add range of steps', () => {
            expect(actBuilder['currentStep']).toBe(-1);
            actBuilder.addRandgeOfSteps(3, () => {});
            expect(actBuilder['currentStep']).toBe(2);
        });

        it('should add range of steps with callback', () => {
            expect(actBuilder['currentStep']).toBe(-1);
            actBuilder.addRandgeOfSteps(3, (step) => {
                step.addNode();
                step.addNode();
                step.addNode();
            });

            expect(actBuilder['nodes']).toHaveLength(9);
            expect(actBuilder['currentStep']).toBe(2);
        });
    });

    describe('addNode', () => {
        it('should add node', () => {
            expect(actBuilder['nodes']).toHaveLength(0);
            actBuilder.addStep((step) => {
                step.addNode();
            });
            expect(actBuilder['nodes']).toHaveLength(1);
        });

        it('should throw expetion if step is not defined', () => {
            expect(actBuilder.addNode).toThrow();
        });
    });

    describe('addRandomNodes', () => {
        it('should add random nodes', () => {
            expect(actBuilder['nodes']).toHaveLength(0);
            actBuilder.addStep((step) => {
                step.addRangeOfNodes(3, 7);
            });
            expect(actBuilder['nodes'].length).toBeLessThanOrEqual(7);
            expect(actBuilder['nodes'].length).toBeGreaterThanOrEqual(3);
        });
    });

    describe('addStep with nodes', () => {
        it('should add step with nodes', () => {
            expect(actBuilder['nodes']).toHaveLength(0);
            expect(actBuilder['currentStep']).toBe(-1);

            actBuilder.addStep((step) => {
                step.addNode();
                step.addNode();
                step.addNode();
            });

            actBuilder.addStep((step) => {
                step.addNode();
                step.addNode();
                step.addNode();
            });

            expect(actBuilder['nodes']).toHaveLength(6);
            expect(actBuilder['currentStep']).toBe(1);
            expect(actBuilder['nodes']).toMatchObject([
                {
                    id: 0,
                    step: 0,
                },

                {
                    id: 1,
                    step: 0,
                },

                {
                    id: 2,
                    step: 0,
                },

                {
                    id: 3,
                    step: 1,
                },

                {
                    id: 4,
                    step: 1,
                },

                {
                    id: 5,
                    step: 1,
                },
            ]);
        });
    });

    describe('fillUndefinedNodes', () => {
        it('should fill undefined nodes', () => {
            expect(actBuilder['nodes']).toHaveLength(0);
            expect(actBuilder['currentStep']).toBe(-1);

            actBuilder.addRandgeOfSteps(3, (step) => {
                step.addNode();
                step.addNode();
                step.addNode();
            });

            actBuilder.fillUndefinedNodes((node, nodes) => {
                return {
                    type: ExpeditionMapNodeTypeEnum.Combat,
                    subType: ExpeditionMapNodeTypeEnum.CombatElite,
                };
            });

            expect(actBuilder['nodes'][0]).toMatchObject({
                type: ExpeditionMapNodeTypeEnum.Combat,
                subType: ExpeditionMapNodeTypeEnum.CombatElite,
            });
        });
    });
});
