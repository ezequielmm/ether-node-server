import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const NaiadEncounter: Encounter = {
    encounterId: EncounterIdEnum.Naiad,
    encounterName: 'Naiad',
    imageId: 'naiad',
    stages: [
        {
            //0
            displayText:
                'A Naiad emerges from a pond, her body wrapped in foam and pond weed. She speaks an odd language that sounds like a bubbling brook. You feel drawn to her.',
            buttons: [
                {
                    text: 'A: Go to the Naiad [Receive one Blessing. Receive one curse.]', // aka option 1
                    nextStage: 1,
                    effects: [
                        { kind: 'card_add_to_library', cardId: '1' }, //TODO correct card id
                        { kind: 'card_add_to_library', cardId: '3' }, //TODO correct card id
                    ],
                },
                {
                    text: 'B: Resist her call [Leave]', // aka option 2
                    nextStage: 2,
                    effects: [],
                },
            ],
        },
        {
            //1 aka option 1
            displayText:
                'You feel dizzy. You try to walk towards the Naiad but you collapse on the grass instead. The last thing you remember before losing consciousness is the soft hand of the Naiad on your forehead…\n' +
                '\n' +
                'You awake later, confused and disoriented. The Naiad is nowhere to be seen.',
            buttons: [],
        },
        {
            //2 aka option 2
            displayText:
                'he jingling of a bell in the distance shakes you from your trance. You turn in the direction of the sound but nothing is there. When you turn back to the pond, the Naiad is gone. Probably for the best. You continue on your way.',
            buttons: [],
        },
    ],
};
