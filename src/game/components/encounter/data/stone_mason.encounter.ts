import { EncounterIdEnum } from "../encounter.enum";
import { Encounter } from "../encounter.schema";

export const StoneMansonEncounter: Encounter = {
    encounterId: EncounterIdEnum.StoneMason,
    encounterName: 'Stone-mason',
    imageId: 'stoneMason',
    stages: [
        {
            //- 0
            displayText: 'The rhythmic echo of steel against stone alerts you to the presence of someone working up ahead. He doesn’t acknowledge you as you approach and continues to excavate the hole he stands in.',
            buttons: [
                {
                    //- aka option 1
                    text: 'Casually stroll up to the man and greet him.',
                    nextStage: 1,
                    effects: [],
                }
            ]
        },
        {
            //- 1
            displayText: 'You shout above the din, “Hail, mason! How fares thee among such blighted climes?” The man stops swinging his pickaxe for just a moment, long enough to mutter back under his breath, “Ain’t got no time for highfalutin folk speakin’ all fancy covered in clunky bits and bobs.” The man promptly returns to digging, muttering something you can’t quite catch.',
            buttons: [
                {
                    //- aka option 3
                    text: " [Challenge the Man] Lose 10 hp. Receive Ether Crystal ",
                    nextStage: 2,
                    effects: [{ kind: 'hit_points_avoid_dead', amount: '-10' }, { kind: 'trinket', item: 'birdcage' }]
                },
                {
                    //- aka option 4
                    text: " [Ignore the Insult] Gain 7 max hp. ",
                    nextStage: 3,
                    effects: [{ kind: 'hp_max', amount: '+7' }]
                    
                }
            ]
        },
        {
            //- 2
            displayText: 'Your frail knightly ego is immediately offended. “Bits and bobs?!” You shout at the man. “Bits and bobs?!” As you unsheath your sword and step menacingly towards the hole, the man ceases digging but does not seem overly concerned. You promptly trip, lose your shield among the rocks and scramble to collect it. Underneath the shield lies a small purple crystal that seems to have gone unnoticed by its excavator. You brush yourself off, and decide to pocket the crystal before storming off with whatever ounce of dignity you still possess.',
            buttons: []
        },
        {
            //- 3
            displayText: 'You take the high road as you always do, (being born of royal blood and all) as you silently ignore the insult from the stranger. You step nimbly around the hole and walk deeper into the caverns with a certain pep in your step that can only come from smug satisfaction.',
            buttons: []
        }
    ]

}