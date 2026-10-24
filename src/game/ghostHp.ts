import type { Attempt } from './store'

// The ghost's health bar is only feedback: partial answers chip away at it,
// but only a fatal answer ever empties it (partial never kills).
export const PARTIAL_DAMAGE = 0.2
export const MIN_HP = 0.1

export function ghostHp(attempts: Attempt[]): number
{
    if (attempts.some((a) => a.verdict === 'fatal')) return 0

    const partials = attempts.filter((a) => a.verdict === 'partial').length
    return Math.max(MIN_HP, 1 - partials * PARTIAL_DAMAGE)
}
