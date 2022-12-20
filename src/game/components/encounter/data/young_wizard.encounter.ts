import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const YoungWizardEncounter: Encounter = {
    encounterId: EncounterIdEnum.YoungWizard,
    imageId: 'youngseatedwizard',
    stages: [
        {
            //0
            displayText:
                'You part some brambles with your sword to find a young man, apparently a wizard, seated against a stone, reading through a strange book. “Ahh, right on time,” he pronounces, without looking up from his tome. “Starting to sense that not all is as it should be on this plane, I assume?” He raises a single brow and looks at you out of the corner of his eye.',
            buttons: [
                {
                    //aka option 1
                    text: 'A: You’ve got that right',
                    nextStage: 1,
                    effects: [],
                },
            ],
        },
        {
            //1 aka option 1
            displayText:
                'The wizard closes his book. “Ever seen one of these?” He asks. “I’ve got a feeling you’re going to need it more than I do.”',
            buttons: [
                {
                    //aka option 2
                    text: 'A: Accept the Book [Lose 1 random card. Gain Runic Tome]',
                    nextStage: 2,
                    effects: [
                        { kind: 'loose_random_card', amount: '1' },
                        { kind: 'trinket', item: 'runic_tomb' },
                    ],
                },
                {
                    //aka option 3
                    text: 'B: Refuse [Gain 100 Coin]',
                    nextStage: 3,
                    effects: [{ kind: 'coin', amount: '100' }],
                },
            ],
        },
        {
            //2 aka option 2
            displayText:
                '“Looks like a useful spellbook,” you offer as you nod in agreement. “Indeed,” says the wizard. He tosses it to you and it lands neatly in your palm, as if made for it. You stuff it into your pack but when you look up, the wizard is nowhere to be seen. “Funny folk, wizards,” you mumble to yourself.',
            buttons: [],
        },
        {
            //3 aka option 3
            displayText:
                '“No thanks,” you reply. “Not in the habit of taking odd books from odd folk in the forest.” The wizard re-opens the book and turns the page, returning to his reading. “Don’t blame ya.” Well take this instead, no sane adventurer says no to a sack of coins.” The wizard tosses you a small coin purse filled with gold. When you look up to thank him, he’s already disappeared.',
            buttons: [],
        },
    ],
}