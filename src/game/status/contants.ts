import { Status, StatusDirection, StatusType } from './interfaces';

export const STATUS_METADATA = 'status';

export const Statuses: { [key: string]: Status } = {
    Resolve: {
        name: 'resolve',
        type: StatusType.Buff, // NOTE: Debuff for the target
        direction: StatusDirection.Outgoing,
    },
    Fortitude: {
        name: 'fortitude',
        type: StatusType.Buff,
        direction: StatusDirection.Incoming,
    },
    Turtling: {
        name: 'turtling',
        type: StatusType.Buff,
        direction: StatusDirection.Incoming,
    },
    HeraldDelayed: {
        name: 'heraldDelayed',
        type: StatusType.Buff,
        direction: StatusDirection.Outgoing,
    },
};
