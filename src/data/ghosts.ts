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
]