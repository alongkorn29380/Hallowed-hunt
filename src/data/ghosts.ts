import type { GhostData } from './types'

export const ghosts: GhostData[] = [
    {
        id: 'werewolf',
        name: 'Werewolf',
        region: 'Europe',
        model: '/models/ghosts/werewolf.glb',
        clues: [
            'Howls at the full moon and changes shape.',
            'Ordinary weapons barely scratch its hide.',
            'Cast a bullet from the shiny white metal used for coins and cutlery.',
        ],
        fatal: [
            { keys: ['silver bullet', 'silver bullets', 'silver ammo', 'silver'], vfx: 'projectile' },
        ],
        partial: ['bullet', 'gun', 'wolfsbane', 'fire'],
    },

    {
        id: 'kappa',
        name: 'Kappa',
        region: 'Japan',
        model: '/models/ghosts/kappa.glb',
        clues: [
            'A river spirit with a dish of water on top of its head.',
            'All of its strength lives in that water, and it is bound by strict manners.',
            'Greet it with perfect courtesy and it cannot help but return the favor.',
        ],
        fatal: [
            { keys: ['bow down', 'bow to', 'bow politely', 'bow respectfully', 'bowing', 'bow'], vfx: 'none' },
        ],
        partial: ['cucumber', 'sumo', 'wrestle'],
    },

    {
        id: 'dracula',
        name: 'Dracula',
        region: 'Romania',
        model: '/models/ghosts/dracula.glb',
        clues: [
            'Wakes at night and must return to his coffin before dawn.',
            'Casts no reflection in a mirror.',
            'If pinned down, the heart is the fatal spot.',
        ],
        fatal: [
            { keys: ['sunlight', 'sun', 'sunshine', 'daylight'], vfx: 'beam' },
            { keys: ['stake', 'wooden stake', 'wood stake'], vfx: 'projectile' },
        ],
        partial: ['garlic', 'cross', 'crucifix', 'holy water'],
    },

    {
        id: 'jiangshi',
        name: 'Jiangshi',
        region: 'China',
        model: '/models/ghosts/jiangshi.glb',
        clues: [
            'Hops forward with stiff arms stretched out in front.',
            'The torn paper on its forehead is the only thing that ever held it.',
            'A Taoist priest would seal it with a fresh charm, or strike it with a sword of peach wood.',
        ],
        fatal: [
            { keys: ['talisman', 'paper charm', 'new charm', 'fresh charm', 'charm'], vfx: 'projectile' },
            { keys: ['peach wood sword', 'peach sword', 'peachwood'], vfx: 'projectile' },
        ],
        partial: ['sticky rice', 'mirror', 'rooster', 'chicken'],
    },

    {
        id: 'golem',
        name: 'Golem',
        region: 'Czech Republic',
        model: '/models/ghosts/golem.glb',
        clues: [
            'Shaped from river clay and brought to life by a rabbi in Prague.',
            'A single Hebrew word on its forehead gives it life.',
            'The word means "truth". Take one letter away and it means "death".',
        ],
        fatal: [
            { keys: ['erase', 'erasing', 'rub out', 'wipe the letter', 'wipe the word', 'remove the letter', 'delete the letter', 'scratch out the letter'], vfx: 'none' },
        ],
        partial: ['water', 'fire', 'hammer', 'smash'],
    },

    {
        id: 'oni',
        name: 'Oni',
        region: 'Japan',
        model: '/models/ghosts/oni.glb',
        clues: [
            'A horned ogre that brings bad luck at the end of winter.',
            'On the eve of spring, families throw something at the door and shout "Oni wa soto!"',
            'Small, roasted, and edible. You eat one for every year of your age.',
        ],
        fatal: [
            { keys: ['soybeans', 'soybean', 'roasted beans', 'beans', 'bean'], vfx: 'projectile' },
        ],
        partial: ['sardine', 'holly', 'sword', 'fire'],
    },

    {
        id: 'krasue',
        name: 'Krasue',
        region: 'Thailand',
        model: '/models/ghosts/krasue.glb',
        clues: [
            'By day she is a quiet woman. By night, only her head flies out.',
            'A glowing trail of entrails drags behind her, snagging on everything.',
            'Villagers line their fences with something sharp and prickly.',
        ],
        fatal: [
            { keys: ['thorn', 'thorns', 'thorny branch', 'barbed wire'], vfx: 'projectile' },
        ],
        partial: ['sunrise', 'dawn', 'her body', 'hide the body'],
    },

    {
        id: 'medusa',
        name: 'Medusa',
        region: 'Greece',
        model: '/models/ghosts/medusa.glb',
        clues: [
            'Her gaze turns anyone who meets it into stone.',
            'The hero never looked at her directly.',
            'He watched her through something polished and flat.',
        ],
        fatal: [
            { keys: ['mirror', 'mirrors', 'reflect', 'shield', 'bronze shield'], vfx: 'beam' },
        ],
        partial: ['blindfold', 'sword', 'sunglasses', 'close your eyes', 'helmet'],
    },

    {
        id: 'fairy',
        name: 'Fairy',
        region: 'Ireland',
        model: '/models/ghosts/fairy.glb',
        clues: [
            'Small, glittering, and fond of tricks. Ordinary charms barely bother it.',
            'Old cottages hung a lucky charm over the door to keep it out.',
            'It is the metal a blacksmith hammers: not silver, not gold.',
        ],
        fatal: [
            { keys: ['cold iron', 'iron', 'horseshoe'], vfx: 'projectile' },
        ],
        partial: ['salt', 'bread', 'bell', 'rowan', 'clover'],
    },

    {
        id: 'sphinx',
        name: 'Sphinx',
        region: 'Egypt',
        model: '/models/ghosts/sphinx.glb',
        clues: [
            'Four legs in the morning, two at noon, three in the evening. What am I?',
            'Morning is infancy. Evening is old age.',
            'The third leg is a walking stick. Answer with what you are.',
        ],
        fatal: [
            { keys: ['man', 'a man', 'human', 'humans', 'mankind', 'person'], vfx: 'none' },
        ],
        partial: ['baby', 'crawl', 'cane', 'walking stick', 'child', 'elder', 'woman'],
    },
]