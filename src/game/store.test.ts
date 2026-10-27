import { beforeEach, describe, expect, it } from 'vitest'
import { ghosts } from '../data/ghosts'
import { MAX_HEARTS, useGame } from './store'

const g = () => useGame.getState()

const fatal = (i: number) => ghosts[i].fatal[0]
const partial = (i: number) => ghosts[i].partial[0]
const WRONG = ['zzz1', 'zzz2', 'zzz3', 'zzz4', 'zzz5', 'zzz6']

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

    it('a repeated answer is flagged, and the flag clears on the next new answer', () => {
        g().start()
        g().submit(WRONG[0])
        expect(g().repeated).toBe(false)
        g().submit(WRONG[0])
        expect(g().repeated).toBe(true)
        expect(g().hearts).toBe(MAX_HEARTS - 1)
        g().submit(WRONG[1])
        expect(g().repeated).toBe(false)
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

    it('shatterDone is false after a fatal answer until the effect reports done', () => {
        g().start()
        expect(g().shatterDone).toBe(true)
        g().submit(fatal(0).keys[0])
        expect(g().shatterDone).toBe(false)
        g().setShatterDone(true)
        expect(g().shatterDone).toBe(true)
    })

    it('projectile and beam kills wait for impact, others shatter immediately', () => {
        ghosts.forEach((ghost, i) => {
            for (const f of ghost.fatal) {
                g().start()
                useGame.setState({ ghostIndex: i })
                g().submit(f.keys[0])
                expect(g().phase, `${ghost.id}: ${f.keys[0]}`).toBe('ghostDown')
                expect(g().impact, `${ghost.id}: ${f.keys[0]}`).toBe(f.vfx === 'none')
                g().setImpact(true)
                expect(g().impact).toBe(true)
            }
        })
    })

    it('start resets shatterDone', () => {
        g().start()
        g().submit(fatal(0).keys[0])
        g().start()
        expect(g().shatterDone).toBe(true)
    })

    it('next moves on to the following ghost and resets the round', () => {
        g().start()
        g().submit(WRONG[0])
        g().submit(WRONG[1])
        g().submit(fatal(0).keys[0])
        g().next()
        expect(g().phase).toBe('battle')
        expect(g().ghostIndex).toBe(1)
        expect(g().clues).toBe(0)
        expect(g().attempts).toHaveLength(0)
        // two hearts lost, one won back for the kill
        expect(g().hearts).toBe(MAX_HEARTS - 1)
    })

    it('defeating a ghost wins a heart back, but never above the maximum', () => {
        g().start()
        g().submit(WRONG[0])
        g().submit(WRONG[1])
        expect(g().hearts).toBe(MAX_HEARTS - 2)
        g().submit(fatal(0).keys[0])
        expect(g().hearts).toBe(MAX_HEARTS - 1)

        g().next()
        g().submit(fatal(1).keys[0])
        expect(g().hearts).toBe(MAX_HEARTS)

        g().next()
        g().submit(fatal(2).keys[0])
        expect(g().hearts).toBe(MAX_HEARTS)
    })

    it('a win does not make the run safe: five wrong answers on the next ghost still lose', () => {
        g().start()
        g().submit(fatal(0).keys[0])
        g().next()
        for (let i = 0; i < MAX_HEARTS; i++) g().submit(WRONG[i])
        expect(g().phase).toBe('lost')
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
