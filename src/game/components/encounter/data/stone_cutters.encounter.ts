import { EncounterIdEnum } from "../encounter.enum";
import { Encounter } from "../encounter.schema";

export const StoneCuttersEncounter: Encounter = {
    encounterId: EncounterIdEnum.StoneCutter,
    encounterName: 'Stone-cutters',
    stageNumber: 2,
    imageId: 'stoneCutters',
    stages: [
        {
            //- 0
            displayText: 'As you turn a corner, you’re taken aback by a small huddled group of gnomes carrying stone cutting tools and towing large (for their size) wheelbarrows full of shiny ore. They seem to have known you were coming and have backed themselves into a corner, brandishing their pickaxes in a menacing manner.’',
            buttons: [
                {
                    //- aka option 1
                    text: " [Trade] Trade your most recently acquired Trinket for Silver Ore. ",
                    nextStage: 1,
                    effects: [{ kind: 'lost_recent_trinket' },  { kind: 'trinket', item: 'birdcage' }]
                },
                {
                    //- aka option 1
                    text: " [Pass Through] Nothing happens. ",
                    nextStage: 2,
                    effects: []
                },
            ]
        },
        {
            //- 1
            displayText: 'You tentatively offer up something from your bag and point insistently at the ore in the Gnomes’ wheelbarrows. They seem to take the hint. One steps forward and snatches the Trinket from your hand, turning it over and over before showing it to his companions. After a few hushed words back and forth that you can’t make out, one of the Gnomes steps forward with a small piece of Silver Ore, offering it to you in his small outstretched hand.',
            buttons: []
        },
        {
            //- 2
            displayText: 'Just by the posture and the expressions of the Gnomes, you can tell you aren’t wanted here. You give their small group a wide berth as you walk slowly past them deeper into the caverns, checking over your shoulder as you go. The little guys give off some bad vibes.',
            buttons: []
        }
    ]

}