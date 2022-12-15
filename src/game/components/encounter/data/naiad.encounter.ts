import { Encounter } from "../encounter.schema";


export const NaiadEncounter: Encounter = {
    encounterId: 5,
    imageId: 'naiad',
    stages: [
        {
            displayText:
                'A Naiad emerges from a pond, her body wrapped in foam and pond weed. She speaks an odd language that sounds like a bubbling brook. You feel drawn to her.',
            buttons: [
                {
                    text: 'A: Go to the Naiad [Receive one Blessing. Receive one curse.]',
                    nextStage: 1,
                    effects: [
                        { kind: 'card_add_to_library', cardId: '0' },
                        { kind: 'card_add_to_library', cardId: '0' },
                    ],
                },
                {
                    text: 'B: Resist her call [Leave]',
                    nextStage: 2,
                    effects: [],
                },
            ],
        },
        {
            displayText:
                'You feel dizzy. You try to walk towards the Naiad but you collapse on the grass instead. The last thing you remember before losing consciousness is the soft hand of the Naiad on your forehead…\n' +
                '\n' +
                'You awake later, confused and disoriented. The Naiad is nowhere to be seen.',
            buttons: [],
        },
        {
            displayText:
                'he jingling of a bell in the distance shakes you from your trance. You turn in the direction of the sound but nothing is there. When you turn back to the pond, the Naiad is gone. Probably for the best. You continue on your way.',
            buttons: [],
        },
    ],
};