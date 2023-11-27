import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const OddbarksEncounter: Encounter = {
    encounterId: EncounterIdEnum.Oddbarks,
    encounterName: 'Oddbarks',
    stageNumber: 1,
    imageId: 'stumpcreatures',
    stages: [
        {
            //0
            displayText:
                'Three small forms jump out from behind a tree! They grumble excitedly in an unknown tongue that sounds like the creaking of branches in the wind. They jump back and forth, not especially scared of you. One waddles forward, sticks out both of its upturned limbs and stares at you expectantly.',
            buttons: [
                {
                    text: 'Click here to offer a Trinket [Transform Trinket]', // aka option 1
                    nextStage: 1,
                    //awaitModal: true,
                    effects: [{ kind: 'choose_trinket', amount: 1 }],
                },
                {
                    text: 'Click here to offer 2 Trinkets [Transform 2 Trinkets]', // aka option 2
                    nextStage: 2,
                    effects: [{ kind: 'choose_trinket', amount: 2 }],
                },
                {
                    text: 'Click here to walk on [Leave]',
                    nextStage: 2,
                    effects: [],
                },
            ],
        },
        {
            //1 aka option 1
            displayText:
                'You rummage through your pack and offer the odd creature an item. He bolts back towards his companions, and they huddle in a circle. You begin to step towards them, worried they might be stealing from you. Before you can take a second step, they break their huddle and scatter with impressive speed in separate directions… Resting on the ground where they had been just moments ago is a new trinket.',
            buttons: [],
        },
        {
            //2 aka option 2
            displayText:
                'You rummage through your pack and offer the odd creature a pair of your items. He bolts back towards his 2 companions, and they huddle in a circle. You begin to step towards them, worried they might be stealing from you. Before you can take a second step, they break their huddle and scatter with impressive speed in 3 separate directions… Resting on the ground where they had been just moments ago are 2 other trinkets.',
            buttons: [],
        },
        {
            //3 aka option 3
            displayText:
                'You aren’t sure what the creature wants. You bow politely and edge past them on the trail. When you glance back, the trio are gone.',
            buttons: [],
        },
    ],
};
