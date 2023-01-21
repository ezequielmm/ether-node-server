import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const NagpraEncounter: Encounter = {
    encounterId: EncounterIdEnum.Nagpra,
    encounterName: 'Nagpra',
    imageId: 'nagpra',
    stages: [
        {
            //0
            displayText:
                'At the intersection of a path through the forest you stumble upon some sort of bird creature. They bow before you and hold out a cage housing a dark-feathered bird. They click their beak. You reach out to take the cage but they pull away and click their beak again…',
            buttons: [
                {
                    text: 'Click here to trade for the birdcage [100 Coin]',
                    nextStage: 1,
                    effects: [
                        { kind: 'coin', amount: '-100' },
                        { kind: 'trinket', item: 'birdcage' },
                    ],
                },
                {
                    text: 'Click here to refuse the Offer [Leave]',
                    nextStage: 2,
                    effects: [],
                },
            ],
        },
        {
            //1
            displayText:
                'You like the way the bird looks and it doesn’t seem happy inside the cage. Maybe you can get it to perch on your shoulder and warn you of approaching enemies. You dig into your pocket and hand the creature 100 Coin. He hands you the birdcage, clicks his beak once more, and continues on down the path, leaving you with your new companion.',
            buttons: [],
        },
        {
            //2
            displayText:
                'You aren’t sure what the creature wants. You bow politely and edge past them on the trail. Where would you keep a bird anyways?',
            buttons: [],
        },
    ],
};
