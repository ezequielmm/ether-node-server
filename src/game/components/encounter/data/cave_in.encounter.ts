import { EncounterIdEnum } from "../encounter.enum";
import { Encounter } from "../encounter.schema";

export const CaveInEncounter: Encounter = {
    encounterId: EncounterIdEnum.CaveIn,
    encounterName: 'Cave-in',
    imageId: 'caveIn',
    stages: [
        {
            //- 0
            displayText: 'Your way is blocked. Bummer.',
            buttons: [
                {
                    //- aka option 1
                    text: 'You pry at the boulders in an attempt to dig through to the other side.',
                    nextStage: 1,
                    effects: [],
                },
                {
                    //- aka option 2
                    text: 'You double back to the most recent fork and try your luck down another tunnel.',
                    nextStage: 2,
                    effects: [],
                },
            ]
        },
        {
            //- 1
            displayText: 'In your hubris you reach too far into the pile, nearly crushing your arm as the boulders shift in their place. You barely pull your arm out in time before the boulders shift once again, swiftly dodging the ensuing cascade. You’re gonna feel that in the morning. At least you can see your way through to the other side.',
            buttons: [
                {
                    //- aka option 3
                    text: 'Lose 15 hp. If this would kill you, reduce your hp to 1 instead.',
                    nextStage: 3,
                    effects: [{ kind: 'hit_points_avoid_dead', amount: '-15' }]
                },
                {
                    //- aka option 4
                    text: 'Lose 15 hp. If this would kill you, reduce your hp to 1 instead.',
                    nextStage: 4,
                    effects: [{ kind: 'hp_max', amount: '-5' }, { kind: 'loose_random_potion', amount: '1' },]
                    
                }
            ]
        },
        {
            //- 2
            displayText: 'The tunnels twist and turn, the neverending darkness blots out all sensation of time. An unknown amount of hours later (or is it days) you end up back in front of the boulder pile. Your way is still blocked. Bummer.',
            buttons: [
                {
                    text: 'You pry at the boulders in an attempt to dig through to the other side.',
                    nextStage: 1,
                    effects: []
                }
            ]
        },
        {
            //- 3
            displayText: 'You remove your gauntlet and wrap the wound with some nearby moss. At first it stings, then it actually feels kind of good, then it starts stinging again.',
            buttons: []
        },
        {
            //- 4
            displayText: 'You shake your arm really hard and smack yourself on the helmet with your other hand. You’re a Knight, damn it. Get it together.',
            buttons: []
        }
    ]

}