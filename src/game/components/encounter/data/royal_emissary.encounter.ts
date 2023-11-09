import { getRandomItemByWeight } from "src/utils";
import { EncounterIdEnum } from "../encounter.enum";
import { Encounter } from "../encounter.schema";

export const RoyalEmissaryEncounter: Encounter = {
    encounterId: EncounterIdEnum.RoyalEmissary,
    encounterName: 'Royal-emissary',
    imageId: 'royalEmissary',
    stages: [
        {
            //- 0
            displayText: 'The sound of ethereal trumpets seems to come from everywhere around you. You blink and before you know it, three robed figures stand before you. They speak a strange language but from their posture you can tell they mean to extort you before letting you pass.',
            buttons: [
                {
                    //- aka option 1
                    text: '[Fight] “Unsheath your sword and show them you don’t take kindly to extortion.”',
                    nextStage: 1,
                    effects: [{ kind: 'hp_max', amount: '-5' }]
                },
                {
                    //- aka option 2
                    text: '[Pay Up] “Check your coinpurse to see if you can bribe your way past.”',
                    nextStage: 4,
                    effects: [],
                },
            ]
        },
        {
            //- 1
            displayText: 'In response, two of the figures shift their hands to their own hilts. It’s 3 versus 1 and you like those odds… But before you can make a move the center figure pulls a book out from behind their back, raises it above their head and shouts “VYRN-TUK!” You collapse to the floor, your ears ringing like church bells.',
            buttons: [
                {
                    //- aka option 3
                    text: '[Rise and Fight] Lose 5 max hp. 50% chance to Receive Crimson Codex, 50% chance to Lose all gold.',
                    nextStage: getRandomItemByWeight([2, 3], [50, 50]),
                    effects: []
                },
                {
                    //- aka option 4
                    text: '[Stay Prone] Lose 100 gold.',
                    nextStage: 5,
                    effects: [{ kind: 'coin', amount: '-100' }]

                }
            ]
        },
        {
            //- 2 - win 
            displayText: 'The figures come closer to inspect you, thinking you’re unconscious. Arrogant on their part to assume so little of your constitution. You make quick work of them. The red tome catches your attention. It calls out to you. Why not? Why shouldn’t you take it?.',
            buttons: [
                {
                    //- aka option 3
                    text: 'Proceed.',
                    effects: [{ kind: 'trinket', item: 'birdcage' }]
                }
            ]
        },
        {
            //- 3 - lost
            displayText: 'The figures come closer to inspect you, thinking you’re unconscious. You whirl around and land a blow on one, dashing him against the stalagmites. Before you can turn on the next one, your weapon hilt heats to an unfathomable temperature and you drop your weapon in shock. A blow to the back of your helmet knocks you out cold. You wake some unknowable amount of hours later, your coinpurse lighter and your ego bruised.',
            buttons: [
                {
                    //- aka option 3
                    text: 'Proceed.',
                    effects: [{ kind: 'lost_all_gold' }]
                }
            ]
        },
        {
            //- 4 - Pay up
            displayText: 'You offer up a small amount of gold to the mysterious figures. They seem to take kindly to it and step aside to let you pass. One knight can only fight so much, huh?.',
            buttons: [
                {
                    //- aka option 3
                    text: '[Pay Up] Pay 50 gold.',
                    effects: [{ kind: 'coin', amount: '-50' }]
                }
            ]
        },
        {
            //- 5 - Prone
            displayText: 'Your better judgment takes hold of you and you feign unconsciousness as one of the figures rifles through your things, taking off with some of your gold. Sometimes it’s better to live to fight another day. There’s always more gold, right? … Right?.',
            buttons: []
        }
    ]

}