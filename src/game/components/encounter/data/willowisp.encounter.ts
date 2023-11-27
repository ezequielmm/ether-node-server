import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const WillowispEncounter: Encounter = {
    encounterId: EncounterIdEnum.WillOWisp,
    encounterName: "Will 'o Wisp",
    stageNumber: 1,
    imageId: 'willowisp',
    stages: [
        {
            displayText:
                'You stumble across a glowing orb levitating in mid-air. Your fingers begin to tingle and a feeling of calm washes over you.',
            buttons: [
                {
                    text: 'Click here to kneel before the orb [Increase max hp by 5 to 8]',
                    nextStage: 1,
                    effects: [{ kind: 'hp_max_random', max: '8', min: '5' }],
                },
                {
                    text: 'Click here to reach out & absorb power from the orb [Upgrade 1 random card]',
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
