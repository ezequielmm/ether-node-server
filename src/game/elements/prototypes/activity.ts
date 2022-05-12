import { StateDeltaType } from './types';

export type ActivityParametersType = {
    [key: string]: any;
};

export class Activity {
    constructor(
        public element_type: string,
        public element_id: string | number,
        public activity_key: string,
        public activity_parameters: ActivityParametersType,
        public state_delta: StateDeltaType[],
    ) {}
}
