import { StatusType } from './interfaces';

export const STATUS_METADATA = 'status';

export const Statuses = {
    Resolve: {
        name: 'resolve',
        type: StatusType.Debuff, // NOTE: Debuff for the target
    },
    Fortitude: {
        name: 'fortitude',
        type: StatusType.Buff,
    },
    Turtling: {
        name: 'turtling',
        type: StatusType.Buff,
    },
};
