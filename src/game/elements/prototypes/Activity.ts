export type ActivityParametersType = {
    [key: string]: any;
};

export type StateDeltaType = {
    [key: string]: any;
};

export class Activity {
    constructor(
        public elementType: string,
        public elementId: string | number,
        public activityKey: string,
        public activityParameters: ActivityParametersType,
        public stateDelta: StateDeltaType,
    ) {}
}
