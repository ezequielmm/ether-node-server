import { IExpeditionNode } from '../components/expedition/expedition.interface';
import ExpeditionMap from './map/expeditionMap';

export function generateMap(clientId?: string) {
    const map = new ExpeditionMap(clientId);
    map.initMap();
    return map;
}

export function restoreMap(
    arrayMap: IExpeditionNode[],
    clientId?: string,
): ExpeditionMap {
    const map = new ExpeditionMap(clientId);
    map.restoreMapFromArray(arrayMap);
    return map;
}
