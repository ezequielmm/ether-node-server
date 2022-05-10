import { Activity } from '../elements/prototypes/activity';

export type ElementType = {
    element_id: number | string;
    element_type: string;
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
                activity.element_type === elementType &&
                (elementId === null || activity.element_id === elementId)
            );
        });
    }

    getElements(): ElementType[] {
        // Get ids and remove duplicates using Set
        const ids = new Set(
            this.activities.map(({ element_id: elementId }) => elementId),
        );

        return Array.from(ids).map((id) => {
            return {
                element_id: id,
                element_type: this.activities.find(
                    (activity) => activity.element_id === id,
                ).element_type,
            };
        });
    }
}
