import { Activity } from '../elements/prototypes/Activity';
import { ActivityStep } from './activityStep';

export class ActivityBlock {
    public readonly name: string;
    public steps: ActivityStep[];

    constructor(name: string) {
        this.name = name;
        this.steps = [];
    }

    addStep(step: ActivityStep): void {
        this.steps.push(step);
    }

    addActivity(activity: Activity, currentStep = true): void {
        if (!currentStep || this.steps.length === 0) {
            const step = new ActivityStep();
            step.addActivity(activity);
            this.addStep(step);
        } else {
            this.steps[this.steps.length - 1].addActivity(activity);
        }
    }
}
