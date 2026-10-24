import { describe, expect, it } from 'vitest'
import { MIN_HP, PARTIAL_DAMAGE, ghostHp } from './ghostHp'
import type { Attempt } from './store'

const attempt = (verdict: Attempt['verdict'], text: string = verdict): Attempt => ({ text, verdict })

describe('ghostHp', () => {
    it('starts full', () => {
        expect(ghostHp([])).toBe(1)
    })

    it('wrong answers do not hurt the ghost', () => {
        expect(ghostHp([attempt('wrong', 'a'), attempt('wrong', 'b')])).toBe(1)
    })

    it('each partial answer chips away some health', () => {
        expect(ghostHp([attempt('partial', 'a')])).toBeCloseTo(1 - PARTIAL_DAMAGE)
        expect(ghostHp([attempt('partial', 'a'), attempt('partial', 'b')])).toBeCloseTo(1 - 2 * PARTIAL_DAMAGE)
    })

    it('partial answers never empty the bar', () => {
        const many = Array.from({ length: 50 }, (_, i) => attempt('partial', `p${i}`))
        expect(ghostHp(many)).toBe(MIN_HP)
        expect(MIN_HP).toBeGreaterThan(0)
    })

    it('a fatal answer empties it', () => {
        expect(ghostHp([attempt('partial', 'a'), attempt('fatal', 'b')])).toBe(0)
    })
})
