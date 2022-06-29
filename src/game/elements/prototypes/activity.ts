import * as _ from 'lodash';
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
    ) {
        for (const stateDelta of state_delta) {
            // Get state delta val type
            const stateDeltaValType = typeof stateDelta.val;

            // If val type is already set, serialize it if it's an object
            if (stateDelta.val_type) {
                // Check if val is not a primitive type
                if (_.isObject(stateDelta.val))
                    stateDelta.val = JSON.stringify(stateDelta.val);

                continue;
            }

            // If state delta val is an object, serialize it and get the class name
            if (stateDeltaValType === 'object') {
                stateDelta.val_type = stateDelta.val.constructor.name;
                stateDelta.val = JSON.stringify(stateDelta.val);
            } else {
                // If state delta val is not an object, set the val_type to the val type
                stateDelta.val_type = stateDeltaValType;
            }
        }
    }
}
