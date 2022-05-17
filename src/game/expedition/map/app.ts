import ExpeditionMap from './map/expeditionMap';

export function getTestMap() {
    const map = new ExpeditionMap();
    map.initMap();
    return map.getMap;
}
