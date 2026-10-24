import { describe, expect, it } from 'vitest'
import { ghosts } from '../data/ghosts'
import { judge } from './judge'

const ghost = ghosts[0]
const fatalKey = ghost.fatal[0].keys[0]
const partialKey = ghost.partial[0]

describe('judge', () => {
    it('fatal answers return their vfx', () => {
        expect(judge(ghost, fatalKey)).toEqual({ verdict: 'fatal', vfx: ghost.fatal[0].vfx })
        expect(judge(ghost, `  ${fatalKey.toUpperCase()} `)).toEqual({ verdict: 'fatal', vfx: ghost.fatal[0].vfx })
    })

    it('matches a key inside a longer sentence', () => {
        const long = ghost.fatal[0].keys.find((k) => k.replace(/[^a-z0-9]/gi, '').length >= 4)!
        expect(judge(ghost, `I use a ${long} please!`).verdict).toBe('fatal')
    })

    it('short keys must match exactly', () => {
        const short = ghosts.flatMap((g) => g.fatal.flatMap((f) => f.keys.map((k) => ({ g, k }))))
            .find(({ k }) => k.replace(/[^a-z0-9]/gi, '').length < 4)
        if (!short) return
        expect(judge(short.g, short.k).verdict).toBe('fatal')
        expect(judge(short.g, `${short.k}day`).verdict).toBe('wrong')
    })

    it('partial answers do not kill', () => {
        expect(judge(ghost, partialKey).verdict).toBe('partial')
        expect(judge(ghost, partialKey.replace(/\s+/g, '')).verdict).toBe('partial')
    })

    it('fatal beats partial', () => {
        expect(judge(ghost, `${partialKey} and ${fatalKey}`).verdict).toBe('fatal')
    })

    it('wrong and empty', () => {
        expect(judge(ghost, 'zzz').verdict).toBe('wrong')
        expect(judge(ghost, '').verdict).toBe('empty')
        expect(judge(ghost, '   ').verdict).toBe('empty')
    })
})
