export interface EncounterInterface {
    encounterId: number;
    stage: number;
    afterModal?: number;
}
export class EncounterButton {
    text: string;
    nextStage: number;
    awaitModal?: boolean;
    effects: any[];
}
