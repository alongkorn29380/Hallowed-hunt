import { describe, expect, it } from 'vitest'
import { judge } from '../game/judge'
import { ghosts } from './ghosts'

describe.each(ghosts)('ghost $id', (ghost) => {
    it('has 3 non-empty clues and unique id', () => {
        expect(ghost.clues).toHaveLength(3)
        ghost.clues.forEach((c) => expect(c.trim()).not.toBe(''))
        expect(ghosts.filter((x) => x.id === ghost.id)).toHaveLength(1)
    })

    it('every fatal key is judged fatal', () => {
        for (const f of ghost.fatal)
            for (const key of f.keys)
                expect(judge(ghost, key).verdict, `fatal key "${key}"`).toBe('fatal')
    })

    it('every fatal key returns its own vfx', () => {
        for (const f of ghost.fatal)
            for (const key of f.keys)
                expect(judge(ghost, key).vfx, `fatal key "${key}"`).toBe(f.vfx)
    })

    it('every partial key is judged partial', () => {
        for (const key of ghost.partial)
            expect(judge(ghost, key).verdict, `partial key "${key}"`).toBe('partial')
    })
})
