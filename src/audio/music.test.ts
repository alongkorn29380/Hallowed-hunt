import { describe, expect, it } from 'vitest'
import { isMuted, midiToFreq } from './music'

describe('music', () => {
    it('converts MIDI notes to frequencies', () => {
        expect(midiToFreq(69)).toBeCloseTo(440)
        expect(midiToFreq(57)).toBeCloseTo(220)
        expect(midiToFreq(81)).toBeCloseTo(880)
    })

    it('reads the mute flag without a browser (defaults to unmuted)', () => {
        expect(isMuted()).toBe(false)
    })
})
