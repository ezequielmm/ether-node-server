import { NodeType } from '../../../components/expedition/node-type';
import { NodeStrategy } from './node-strategy';
import { RoyalHouseNodeStrategy } from './royal-house-node-strategy';
import { PortalNodeStrategy } from './portal-node-strategy';
import { EncounterNodeStrategy } from './encounter-node-strategy';
import { CampNodeStrategy } from './camp-node-strategy';

export const strategies = new Map<
    NodeType,
    new (...args: any[]) => NodeStrategy
>([
    [NodeType.RoyalHouse, RoyalHouseNodeStrategy],
    [NodeType.Portal, PortalNodeStrategy],
    [NodeType.Encounter, EncounterNodeStrategy],
    [NodeType.Camp, CampNodeStrategy],
]);
