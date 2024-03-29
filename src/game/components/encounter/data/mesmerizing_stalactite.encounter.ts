import { EncounterIdEnum } from "../encounter.enum";
import { Encounter } from "../encounter.schema";

export const StalactiteEncounter: Encounter = {
    encounterId: EncounterIdEnum.Stalactite,
    encounterName: 'Mesmerizing-stalactite',
    stageNumber: 2,
    imageId: 'memStalactive',
    stages: [
        {
            //- 0
            displayText: 'You seem drawn to the stalactite, this monument to nature’s inexplicable wonders and multifaceted curiosities. All you can think is, ‘Wow, pretty.’',
            buttons: [
                {
                    //- aka option 1
                    text: " [Move Closer] Lose half of your gold. Upgrade 2 random defensive cards. ",
                    nextStage: 1,
                    effects: [{ kind: 'lost_half_gold' }, { kind: 'upgrade_random_deffensivecard', amount: '1' }, { kind: 'upgrade_random_deffensivecard', amount: '1' }]
                },
                {
                    //- aka option 1
                    text: " [Touch It] Lose half of your gold. Upgrade 2 random offensive cards. ",
                    nextStage: 2,
                    effects: [{ kind: 'lost_half_gold' },  { kind: 'upgrade_random_offensivecard', amount: '1' },  { kind: 'upgrade_random_offensivecard', amount: '1' }]
                },
            ]
        },
        {
            //- 1
            displayText: 'You edge closer to the stalactite, wary but intrigued. A feeling of awe and wonder washes over you, but before you can cling to the feeling and savor its significance, it’s gone. You head out into the dark cavern with a renewed sense of calm and purpose.',
            buttons: []
        },
        {
            //- 2
            displayText: 'The stalactite is the most beautiful thing you’ve ever seen. You must touch it. You must. As your gauntlet brushes against the stone, a jolt of energy fires its way through your nervous system, invigorating you and replenishing your strength.',
            buttons: []
        }
    ]

}