import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const DancingSatyrEncounter: Encounter = {
    encounterId: EncounterIdEnum.DancingSatyr,
    encounterName: 'Dancing Satyr',
    stageNumber: 1,
    imageId: 'satyr',
    stages: [
        {
            //0
            displayText:
                'A soft melody graces your ears. A Satyr emerges from behind a large tree, a pan flute pressed to his lips. His level of eye-contact is disconcerting.  “Welcome. To. My. Glade.” He shouts, punctuating brief pauses in the frantic melody as it crescendos. “Shall we?” He asks. He snaps his fingers and the pan flute begins to float in the air and play of its own accord.',
            buttons: [
                {
                    //aka option 1
                    text: 'Click here to dance with the Satyr [Lose 10 Max HP, Start each combat with 1 Resolve]',
                    nextStage: 1,
                    effects: [{ kind: 'hp_max', amount: '-10' }],
                },
                {
                    //aka option 2
                    text: 'Click here to decline the Offer [Leave]',
                    nextStage: 2,
                    effects: [],
                },
            ],
        },
        {
            //1
            displayText:
                'The satyr bows and steps forward, his arms out and at the ready. You bow in return and grasp his hands. Before you know it you’re twirling together through the glade. You admit to yourself that you like it. But you also know you have more pressing matters to attend to…',
            buttons: [
                {
                    //aka option 3
                    text: 'Click here to continue Dancing [Lose 10 more Max HP, upgrade Trinket to 2 Resolve]',
                    nextStage: 3,
                    effects: [{ kind: 'hp_max', amount: '-10' }],
                },
                {
                    //aka option 4
                    text: 'Click here to stop Dancing',
                    nextStage: 4,
                    effects: [{ kind: 'trinket', item: 'pan_flute' }],
                },
            ],
        },
        {
            //2 aka option2
            displayText:
                'The satyr makes you uncomfortable. You decide to politely decline and shuffle your way past the odd creature. He eyes you as you leave and returns to playing his pan flute.',
            buttons: [],
        },
        {
            //3 aka option3
            displayText:
                'You can’t stop dancing. The satyr leads you through increasingly difficult routines. The wind rustling through the trees becomes its own waltz-like melody. You have found perfect bliss. Maybe you will never leave…',
            buttons: [
                {
                    //aka option 5
                    text: 'Click here to stop Dancing',
                    nextStage: 5,
                    effects: [{ kind: 'trinket', item: 'silver_pan_flute' }],
                },
                {
                    //aka option 6
                    text: 'Click here to continue Dancing [Lose 12 more Max HP. Maximize Trinket to 3 Resolve.]',
                    nextStage: 6,
                    effects: [
                        { kind: 'trinket', item: 'golden_pan_flute' },
                        { kind: 'hp_max', amount: '-12' },
                    ],
                },
            ],
        },
        {
            //4 aka option 4
            displayText:
                'Sigh.\n' +
                '\n' +
                'You wish you could stay but you must bid the satyr farewell. Your parting is bittersweet and you secretly hope that you’ll cross paths again soon.',
            buttons: [],
        },

        {
            //5 aka option 5
            displayText:
                'Sigh.\n' +
                '\n' +
                'You wish you could stay but you must bid the satyr farewell. Your parting is bittersweet and you secretly hope that you’ll cross paths again soon.',
            buttons: [],
        },
        {
            //6 aka option6
            displayText:
                'The Satyr is amazed at your willingness to continue dancing, but all good things must come to an end. The sound of another pan flute plays in the distance. The satyr bows, thanking you for your time, and bounds away into the forest.',
            buttons: [],
        },
    ],
};
