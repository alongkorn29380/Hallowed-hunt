import type { GhostData } from './types'

export const ghosts: GhostData[] = [
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
]