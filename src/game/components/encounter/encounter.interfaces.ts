export interface EncounterInterface {
    encounterId: number;
    stage: number;
    afterModal?: number;
    postCardChoiceEffect?: string;
}
export class EncounterButton {
    text: string;
    nextStage: number;
    awaitModal?: boolean;
    effects: any[];
    randomStaging?: any[];
}
