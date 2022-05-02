import { Activity } from '../elements/prototypes/Activity';
import { ActivityStep } from './ActivityStep';

describe('ActivityStep', () => {
    describe('addActivity', () => {
        it('Should add activity', () => {
            const activityStep = new ActivityStep();
            const activity = new Activity(
                'ElementType',
                1,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );

            activityStep.addActivity(activity);
            expect(activityStep.activities.length).toBe(1);
            expect(activityStep.activities[0]).toEqual(activity);
        });
    });

    describe('getActivitiesForElement', () => {
        it('Should return activities for element', () => {
            const activityStep = new ActivityStep();
            const activity = new Activity(
                'ElementTypeA',
                1,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );
            const activity2 = new Activity(
                'ElementTypeB',
                2,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );
            const activity3 = new Activity(
                'ElementTypeA',
                3,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );

            activityStep.addActivity(activity);
            activityStep.addActivity(activity2);
            activityStep.addActivity(activity3);

            expect(
                activityStep.getActivitiesForElement('ElementTypeA').length,
            ).toBe(2);
            expect(
                activityStep.getActivitiesForElement('ElementTypeB').length,
            ).toBe(1);
        });

        it('Should return activity for element and element id', () => {
            const activityStep = new ActivityStep();
            const activity = new Activity(
                'ElementTypeA',
                1,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );
            const activity2 = new Activity(
                'ElementTypeB',
                5,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );
            const activity3 = new Activity(
                'ElementTypeA',
                2,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );

            activityStep.addActivity(activity);
            activityStep.addActivity(activity2);
            activityStep.addActivity(activity3);

            expect(
                activityStep.getActivitiesForElement('ElementTypeA', 1).length,
            ).toBe(1);
            expect(
                activityStep.getActivitiesForElement('ElementTypeB', 1).length,
            ).toBe(0);
        });

        it('Should return elements of all activities', () => {
            const activityStep = new ActivityStep();
            const activity = new Activity(
                'ElementTypeA',
                1,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );
            const activity2 = new Activity(
                'ElementTypeB',
                5,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );
            const activity3 = new Activity(
                'ElementTypeA',
                2,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );
            const activity4 = new Activity(
                'ElementTypeA',
                1,
                'damageReceived',
                { value: 5 },
                { 'enemy.1.hp_current': 42 },
            );

            activityStep.addActivity(activity);
            activityStep.addActivity(activity2);
            activityStep.addActivity(activity3);
            activityStep.addActivity(activity4);

            expect(activityStep.getElements()).toEqual([
                {
                    elementType: 'ElementTypeA',
                    elementId: 1,
                },
                {
                    elementType: 'ElementTypeB',
                    elementId: 5,
                },
                {
                    elementType: 'ElementTypeA',
                    elementId: 2,
                },
            ]);
        });
    });
});
