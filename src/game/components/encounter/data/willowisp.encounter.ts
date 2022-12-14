import { Encounter } from '../encounter.schema';

export const WillowispEncounter: Encounter = {
    encounterId: 6,
    imageId: 'willowisp',
    stages: [
        {
            displayText:
                'You stumble across a glowing orb levitating in mid-air. Your fingers begin to tingle and a feeling of calm washes over you.',
            buttons: [
                {
                    text: 'A: Kneel before the orb [Increase max hp by 10.]',
                    nextStage: 1,
                    effects: [{ kind: 'hp_max', amount: '10' }],
                },
                {
                    text: 'B: Reach out and absorb power from the orb. [Upgrade 1 random card]',
                    nextStage: 2,
                    effects: [{ kind: 'upgrade_random_card', amount: '1' }],
                },
            ],
        },
        {
            displayText:
                'The feeling of calm spreads throughout your body. You feel replenished.',
            buttons: [],
        },
        {
            displayText:
                'You feel compelled to touch the orb. A surge of strength rushes through your limbs when you  make contact.',
            buttons: [],
        },
    ],
};