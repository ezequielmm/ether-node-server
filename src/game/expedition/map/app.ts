import { IExpeditionNode } from '../interfaces';
import ExpeditionMap from './map/expeditionMap';

export function generateMap() {
    const map = new ExpeditionMap();
    map.initMap();
    return map;
}

export function restoreMap(arrayMap: IExpeditionNode[]): ExpeditionMap {
    const map = new ExpeditionMap();
    map.restoreMapFromArray(arrayMap);
    return map;
}
