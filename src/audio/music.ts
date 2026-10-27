// Procedural background music (Web Audio): a spooky chiptune loop, no audio files needed.
// Browsers only allow audio after a user gesture, so startMusic() is called from the Start button.

const BPM = 84
const STEP = 60 / BPM / 2 // one eighth note, in seconds
const STEPS_PER_BAR = 8
const LOOKAHEAD = 0.2
const TICK_MS = 50
const MASTER_VOLUME = 0.22
const STORAGE_KEY = 'hallowed-hunt-muted'

interface Bar
{
    bass: number
    arp: [number, number, number]
}

// A minor with a major E at the end for tension (MIDI note numbers)
const BARS: Bar[] = [
    { bass: 45, arp: [57, 60, 64] }, // Am
    { bass: 41, arp: [53, 57, 60] }, // F
    { bass: 43, arp: [55, 59, 62] }, // G
    { bass: 40, arp: [52, 56, 59] }, // E
]
const ARP_PATTERN = [0, 1, 2, 1, 0, 1, 2, 1]

// [bar, step, midi, length in steps]
const LEAD: [number, number, number, number][] = [
    [0, 0, 69, 4], [0, 4, 72, 2], [0, 6, 71, 2],
    [1, 0, 69, 4], [1, 4, 65, 4],
    [2, 0, 67, 4], [2, 4, 71, 2], [2, 6, 74, 2],
    [3, 0, 76, 6], [3, 6, 68, 2],
]

const LOOP_STEPS = BARS.length * STEPS_PER_BAR

export function midiToFreq(midi: number): number
{
    return 440 * Math.pow(2, (midi - 69) / 12)
}

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noise: AudioBuffer | null = null
let timer = 0
let nextTime = 0
let step = 0
let muted: boolean | null = null

function readMuted(): boolean
{
    try {
        return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

export function isMuted(): boolean
{
    if (muted === null) muted = readMuted()
    return muted
}

export function setMuted(value: boolean)
{
    muted = value
    try {
        localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
    } catch {
        // storage can be blocked; the choice just won't be remembered
    }
    if (ctx && master) master.gain.setTargetAtTime(value ? 0 : MASTER_VOLUME, ctx.currentTime, 0.1)
}

function tone(freq: number, time: number, duration: number, type: OscillatorType, volume: number)
{
    if (!ctx || !master) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq

    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.linearRampToValueAtTime(volume, time + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration)

    osc.connect(gain)
    gain.connect(master)
    osc.start(time)
    osc.stop(time + duration + 0.05)
}

function kick(time: number, volume: number)
{
    if (!ctx || !master) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(110, time)
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.14)

    gain.gain.setValueAtTime(volume, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2)

    osc.connect(gain)
    gain.connect(master)
    osc.start(time)
    osc.stop(time + 0.25)
}

function hat(time: number, volume: number)
{
    if (!ctx || !master || !noise) return

    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()
    source.buffer = noise
    filter.type = 'highpass'
    filter.frequency.value = 7000

    gain.gain.setValueAtTime(volume, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(master)
    source.start(time)
}

function makeNoise(context: AudioContext): AudioBuffer
{
    const buffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.1), context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return buffer
}

function schedule(index: number, time: number)
{
    const inLoop = index % LOOP_STEPS
    const pass = Math.floor(index / LOOP_STEPS)
    const barIndex = Math.floor(inLoop / STEPS_PER_BAR)
    const s = inLoop % STEPS_PER_BAR
    const bar = BARS[barIndex]

    // heartbeat + sparse hat
    if (s === 0) kick(time, 0.5)
    if (s === 4) kick(time, 0.32)
    if (s === 2 || s === 6) hat(time, 0.08)

    // bass: root on the downbeat and the middle of the bar
    if (s === 0 || s === 4) tone(midiToFreq(bar.bass), time, STEP * 3.6, 'triangle', 0.5)

    // arpeggio, an octave higher on every second pass
    const octave = pass % 2 === 1 ? 12 : 0
    tone(midiToFreq(bar.arp[ARP_PATTERN[s]] + octave), time, STEP * 0.9, 'square', 0.07)

    // lead melody only on even passes, so the loop breathes
    if (pass % 2 === 0) {
        for (const [b, st, midi, length] of LEAD) {
            if (b === barIndex && st === s) tone(midiToFreq(midi), time, STEP * length * 0.95, 'triangle', 0.22)
        }
    }
}

function tick()
{
    if (!ctx) return

    while (nextTime < ctx.currentTime + LOOKAHEAD) {
        schedule(step, nextTime)
        nextTime += STEP
        step++
    }
}

// Pause while the tab is hidden so the scheduler doesn't pile up notes
function onVisibility()
{
    if (!ctx) return
    if (document.hidden) void ctx.suspend()
    else void ctx.resume()
}

export function startMusic()
{
    if (!ctx) {
        try {
            ctx = new AudioContext()
        } catch {
            return
        }

        master = ctx.createGain()
        master.gain.value = 0
        master.connect(ctx.destination)
        noise = makeNoise(ctx)

        nextTime = ctx.currentTime + 0.1
        timer = window.setInterval(tick, TICK_MS)
        document.addEventListener('visibilitychange', onVisibility)

        // slow fade in
        master.gain.setTargetAtTime(isMuted() ? 0 : MASTER_VOLUME, ctx.currentTime, 0.8)
    }

    void ctx.resume()
}

export function stopMusic()
{
    window.clearInterval(timer)
    document.removeEventListener('visibilitychange', onVisibility)
    if (ctx) void ctx.close()
    ctx = null
    master = null
    noise = null
    step = 0
}
