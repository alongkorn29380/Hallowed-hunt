import type { GhostData, Vfx } from '../data/types'

export type Verdict = 'fatal' | 'partial' | 'wrong' | 'empty'
export interface JudgeResult { verdict: Verdict; vfx?: Vfx}

export function normalize(text: string): string
{
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function matches(input: string, key: string): boolean
{
    return input === key || (key.length >= 4 && input.includes(key))
}

export function judge(ghost: GhostData, raw: string): JudgeResult
{
    const input = normalize(raw)
    if (matches(input, '')) return { verdict: 'empty'}

    const fatal = ghost.fatal.find(f => f.keys.some((k) => matches(input, normalize(k))))
    if (fatal) return { verdict: 'fatal', vfx: fatal.vfx }

    if (ghost.partial.some((k) => matches(input, normalize(k)))) {
        return { verdict: 'partial' }
    }

    return { verdict: 'wrong' }
}