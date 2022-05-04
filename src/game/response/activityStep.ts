import { Activity } from '../elements/prototypes/activity';

export type ElementType = {
    elementId: number | string;
    elementType: string;
};

export class ActivityStep {
    public activities: Activity[];

    constructor() {
        this.activities = [];
    }

    addActivity(activity: Activity): void {
        this.activities.push(activity);
    }

    getActivitiesForElement(
        elementType: string,
        elementId: number | string = null,
    ): Activity[] {
        return this.activities.filter((activity) => {
            return (
                activity.elementType === elementType &&
                (elementId === null || activity.elementId === elementId)
            );
        });
    }

    getElements(): ElementType[] {
        // Get ids and remove duplicates using Set
        const ids = new Set(this.activities.map(({ elementId }) => elementId));

        return Array.from(ids).map((id) => {
            return {
                elementId: id,
                elementType: this.activities.find(
                    (activity) => activity.elementId === id,
                ).elementType,
            };
        });
    }
}
