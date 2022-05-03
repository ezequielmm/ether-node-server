import { StateDeltaType } from './types';

export type ActivityParametersType = {
    [key: string]: any;
};

export class Activity {
    constructor(
        public elementType: string,
        public elementId: string | number,
        public activityKey: string,
        public activityParameters: ActivityParametersType,
        public stateDelta: StateDeltaType[],
    ) {}
}
