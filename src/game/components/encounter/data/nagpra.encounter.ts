import { Encounter } from '../encounter.schema';
import { AttackCard } from '../../card/data/attack.card';
import { DefenseCard } from '../../card/data/defend.card';

export const NagpraEncounter: Encounter = {
    encounterId: 3,
    stages: [
        {
            displayText:
                'At the intersection of a path through the forest you stumble upon some sort of bird creature. They bow before you and hold out a cage housing a dark-feathered bird. They click their beak. You reach out to take the cage but they pull away and click their beak again…',
            buttonText: [
                'Trade for the birdcage [100 Coin]',
                'Refuse the Offer [Leave]',
            ],
            effects: [],
        },
        {
            displayText:
                'You aren’t sure what the creature wants. You bow politely and edge past them on the trail. Where would you keep a bird anyways?',
            buttonText: ['Done'],
            effects: [],
        },
    ],
};
