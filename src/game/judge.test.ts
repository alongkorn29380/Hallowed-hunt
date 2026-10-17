import { describe, expect, it } from 'vitest'
import { ghosts } from '../data/ghosts'
import { judge } from './judge'

const dracula = ghosts[0]

describe('judge', () => {
    it('fatal answers return their vfx', () => {
        expect(judge(dracula, 'Sunlight')).toEqual({ verdict: 'fatal', vfx: 'beam' })
        expect(judge(dracula, '  SUN ')).toEqual({ verdict: 'fatal', vfx: 'beam' })
        expect(judge(dracula, 'Wooden   Stake')).toEqual({ verdict: 'fatal', vfx: 'projectile' })
    })

    it('matches a key inside a longer sentence', () => {
        expect(judge(dracula, 'I use a wooden stake!').verdict).toBe('fatal')
    })

    it('short keys must match exactly', () => {
        expect(judge(dracula, 'sunday').verdict).toBe('wrong')
    })

    it('partial answers do not kill', () => {
        expect(judge(dracula, 'garlic').verdict).toBe('partial')
        expect(judge(dracula, 'Holy Water').verdict).toBe('partial')
        expect(judge(dracula, 'holywater').verdict).toBe('partial')
    })

    it('fatal beats partial', () => {
        expect(judge(dracula, 'garlic and sunlight').verdict).toBe('fatal')
    })

    it('wrong and empty', () => {
        expect(judge(dracula, 'salt').verdict).toBe('wrong')
        expect(judge(dracula, '').verdict).toBe('empty')
        expect(judge(dracula, '   ').verdict).toBe('empty')
    })
})