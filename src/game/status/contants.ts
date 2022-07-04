import { StatusType } from './interfaces';

export const STATUS_METADATA = 'status';

export const Statuses = {
    Resolve: {
        name: 'resolve',
        type: StatusType.Buff,
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
