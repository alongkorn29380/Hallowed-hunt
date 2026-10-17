export type Vfx = 'beam' | 'projectile' | 'none'

export interface Fatal {
    keys: string[]
    vfx: Vfx
}

export interface GhostData {
    id: string
    name: string
    region: string
    model: string
    clues: [string, string, string]
    fatal: Fatal[]
    partial: string[]
}