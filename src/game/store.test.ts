import { beforeEach, describe, expect, it } from 'vitest'
import { ghosts } from '../data/ghosts'
import { MAX_HEARTS, useGame } from './store'

const g = () => useGame.getState()

const fatal = (i: number) => ghosts[i].fatal[0]
const partial = (i: number) => ghosts[i].partial[0]
const WRONG = ['zzz1', 'zzz2', 'zzz3', 'zzz4']

beforeEach(() => { g().reset() })

describe('game store', () => {
    it('start puts us in battle with full hearts on the first ghost', () => {
        g().start()
        expect(g().phase).toBe('battle')
        expect(g().hearts).toBe(MAX_HEARTS)
        expect(g().ghostIndex).toBe(0)
    })

    it('wrong answer costs a heart and reveals a clue', () => {
        g().start()
        g().submit(WRONG[0])
        expect(g().hearts).toBe(MAX_HEARTS - 1)
        expect(g().clues).toBe(1)
        expect(g().attempts).toEqual([{ text: WRONG[0], verdict: 'wrong' }])
    })

    it('partial answer costs nothing', () => {
        g().start()
        g().submit(partial(0))
        expect(g().hearts).toBe(MAX_HEARTS)
        expect(g().clues).toBe(0)
        expect(g().attempts).toHaveLength(1)
    })

    it('repeating an answer is free', () => {
        g().start()
        g().submit(WRONG[0])
        g().submit(`  ${WRONG[0].toUpperCase()} `)
        expect(g().hearts).toBe(MAX_HEARTS - 1)
        expect(g().attempts).toHaveLength(1)
    })

    it('empty input is ignored', () => {
        g().start()
        g().submit('   ')
        expect(g().hearts).toBe(MAX_HEARTS)
        expect(g().attempts).toHaveLength(0)
    })

    it('fatal answer downs the ghost and stores the vfx', () => {
        g().start()
        g().submit(fatal(0).keys[0])
        expect(g().phase).toBe('ghostDown')
        expect(g().lastVfx).toBe(fatal(0).vfx)
    })

    it('running out of hearts loses the run', () => {
        g().start()
        for (let i = 0; i < MAX_HEARTS; i++) g().submit(WRONG[i])
        expect(g().hearts).toBe(0)
        expect(g().phase).toBe('lost')
        expect(g().clues).toBe(3)
    })

    it('ignores answers after the battle ends', () => {
        g().start()
        g().submit(fatal(0).keys[0])
        g().submit(WRONG[0])
        expect(g().hearts).toBe(MAX_HEARTS)
    })

    it('next moves on to the following ghost and resets the round', () => {
        g().start()
        g().submit(WRONG[0])
        g().submit(fatal(0).keys[0])
        g().next()
        expect(g().phase).toBe('battle')
        expect(g().ghostIndex).toBe(1)
        expect(g().clues).toBe(0)
        expect(g().attempts).toHaveLength(0)
        expect(g().hearts).toBe(MAX_HEARTS - 1)
    })

    it('next after the last ghost wins the run', () => {
        g().start()
        ghosts.forEach((_, i) => {
            g().submit(fatal(i).keys[0])
            g().next()
        })
        expect(g().phase).toBe('won')
    })
})
