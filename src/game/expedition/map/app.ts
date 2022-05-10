import MapGenerator from './mapGenerator/mapGenerator';
import { actCconfigAlternatives } from './act/act.config';

export function getTestMap() {
    const map = new MapGenerator();
    map.addAct(1, actCconfigAlternatives);
    return map.currentMap;
}
