import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const RunicBeehiveEncounter: Encounter = {
    encounterId: EncounterIdEnum.RunicBehive,
    encounterName: 'Runic Beehive',
    imageId: 'runicbeehive',
    stages: [
        {
            //0
            displayText:
                'A buzzzz fills your ears as you enter the next clearing. Blue, glowing, bee-type creatures seem to be swarming around a humongous beehive. The first thing that comes to your mind, like the glutton that you are, is the sweet taste of a spoonful of honey.',
            buttons: [
                {
                    // aka option 1
                    text: 'Click here to sneak Past [Nothing Happens]',
                    nextStage: 1,
                    effects: [], //TODO confirm no cards added when sneaking by
                },
                {
                    // aka option 2
                    text: 'Click here to steal Honey [50% chance of gaining Stolen Honey Trinket, 50% chance of gaining Bee Venom Curse Card]',
                    nextStage: 2, // actually random between stage 2 and 3 see randomStaging
                    effects: [],
                    randomStaging: [
                        {
                            nextStage: 2,
                            effects: [
                                { kind: 'trinket', item: 'birdcage' }, // TODO Trinket: Stolen Honey
                            ],
                        },
                        {
                            nextStage: 3,
                            effects: [
                                { kind: 'card_add_to_library', cardId: '1' }, // TODO Card: Curse - Bee Venom
                            ],
                        },
                    ],
                },
            ],
        },
        {
            //1 aka option 1
            displayText:
                'Your better nature prevails, and you attempt to sneak past the hive. The buzzing seems to rise in pitch, but aside from a singular glowing bee that pauses midair in front of your helmet, the hive leaves you alone. Back to battle you go.',
            buttons: [],
        },
        {
            //2 aka option 2 randomly
            displayText:
                'After tightening your gauntlets and double checking your boot laces, you inch your way towards the hive. As soon as you make contact with it, the volume of the buzzing swells in intensity. Thankfully, you’ve been here before, the seasoned honey-stealing scoundrel that you are. You breathe calmly and force your heart rate to lower, knowing that bees respond to fear. You slowly but surely peel away a bit of the outer hive, scoop a glob of honey out with your hand and make a hasty retreat to the treeline. Success never tasted so sweet!',
            buttons: [],
        },
        {
            //3 aka option 2 randomly
            displayText:
                'After stumbling closer to the hive, half drunk off the sweet scent of honey that fills the air, you begin to hastily peel away at the outside of the hive. As soon as you do so, the bees begin to swarm, dozens of their tiny, winged bodies pelting every inch of your armor, probing for openings. A few make their way through the slits in your helmet and sink their stingers into your cheek, sacrificing their noble lives to protect their illuminated community. Overwhelmed with fear and pain, you clumsily swat at the air around you as the bees chase you for hundreds of feet in the direction of your escape. Better luck next time, Bozo.',
            buttons: [],
        },
    ],
};
