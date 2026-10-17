// src/game/store.ts
import { create } from 'zustand'
import { ghosts } from '../data/ghosts'
import type { Vfx } from '../data/types'
import { judge, normalize, type Verdict } from './judge'

export type Phase = 'title' | 'battle' | 'ghostDown' | 'won' | 'lost'
export interface Attempt { text: string; verdict: Verdict }

interface GameState {
    phase: Phase
    hearts: number
    ghostIndex: number
    clues: number
    attempts: Attempt[]
    lastVfx: Vfx | null
    start: () => void
    submit: (text: string) => void
    next: () => void
    reset: () => void
}

const initial = {
    phase: 'title' as Phase,
    hearts: 3,
    ghostIndex: 0,
    clues: 0,
    attempts: [] as Attempt[],
    lastVfx: null as Vfx | null,
}

export const useGame = create<GameState>((set, get) => ({
    ...initial,

    start: () => set({ ...initial, phase: 'battle' }),

    reset: () => set(initial),

    submit: (text) => {
        const s = get()
        if (s.phase !== 'battle') return

        const result = judge(ghosts[s.ghostIndex], text)
        if (result.verdict === 'empty') return

        const key = normalize(text)
        if (s.attempts.some((a) => normalize(a.text) === key)) return

        const attempts = [...s.attempts, { text: text.trim(), verdict: result.verdict }]

        switch (result.verdict) {
            case 'fatal':
                set({ attempts, phase: 'ghostDown', lastVfx: result.vfx ?? null })
                break
            case 'partial':
                set({ attempts })
                break
            case 'wrong': {
                const hearts = s.hearts - 1
                set({
                    attempts,
                    hearts,
                    clues: Math.min(3, s.clues + 1),
                    phase: hearts <= 0 ? 'lost' : 'battle',
                })
                break
            }
        }
    },

    next: () => {
        const s = get()
        if (s.phase !== 'ghostDown') return

        const nextIndex = s.ghostIndex + 1
        if (nextIndex >= ghosts.length) {
            set({ phase: 'won' })
            return
        }

        set({ ghostIndex: nextIndex, clues: 0, attempts: [], lastVfx: null, phase: 'battle' })
    },
}))