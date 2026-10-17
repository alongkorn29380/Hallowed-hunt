import { beforeEach, describe, expect, it } from 'vitest'
import { useGame } from './store'

const g = () => useGame.getState()

beforeEach(() => { g().reset() })

describe('game store', () => {
    it('start puts us in battle with 3 hearts on the first ghost', () => {
        g().start()
        expect(g().phase).toBe('battle')
        expect(g().hearts).toBe(3)
        expect(g().ghostIndex).toBe(0)
    })

    it('wrong answer costs a heart and reveals a clue', () => {
        g().start()
        g().submit('salt')
        expect(g().hearts).toBe(2)
        expect(g().clues).toBe(1)
        expect(g().attempts).toEqual([{ text: 'salt', verdict: 'wrong' }])
    })

    it('partial answer costs nothing', () => {
        g().start()
        g().submit('garlic')
        expect(g().hearts).toBe(3)
        expect(g().clues).toBe(0)
        expect(g().attempts).toHaveLength(1)
    })

    it('repeating an answer is free', () => {
        g().start()
        g().submit('salt')
        g().submit('  SALT ')
        expect(g().hearts).toBe(2)
        expect(g().attempts).toHaveLength(1)
    })

    it('empty input is ignored', () => {
        g().start()
        g().submit('   ')
        expect(g().hearts).toBe(3)
        expect(g().attempts).toHaveLength(0)
    })

    it('fatal answer downs the ghost and stores the vfx', () => {
        g().start()
        g().submit('sunlight')
        expect(g().phase).toBe('ghostDown')
        expect(g().lastVfx).toBe('beam')
    })

    it('three wrong answers lose the run', () => {
        g().start()
        g().submit('salt')
        g().submit('water')
        g().submit('fire')
        expect(g().hearts).toBe(0)
        expect(g().phase).toBe('lost')
        expect(g().clues).toBe(3)
    })

    it('ignores answers after the battle ends', () => {
        g().start()
        g().submit('sunlight')
        g().submit('salt')
        expect(g().hearts).toBe(3)
    })

    it('next after the last ghost wins the run', () => {
        g().start()
        g().submit('sunlight')
        g().next()
        expect(g().phase).toBe('won')
    })
})