import { useCallback, useState } from 'react'
import { startMusic } from '../audio/music'
import { ghosts } from '../data/ghosts'
import { MAX_HEARTS, useGame } from '../game/store'
import Embers from './Embers'
import GhostCard from './GhostCard'
import './ui.css'

export default function EndScreen()
{
    const phase = useGame((s) => s.phase)
    const hearts = useGame((s) => s.hearts)
    const ghostIndex = useGame((s) => s.ghostIndex)
    const start = useGame((s) => s.start)
    const [open, setOpen] = useState<number | null>(null)

    const won = phase === 'won'

    const banished = won ? ghosts.length : ghostIndex

    const close = useCallback(() => setOpen(null), [])
    const step = useCallback((direction: -1 | 1) =>
    {
        setOpen((i) => (i === null || banished === 0 ? null : (i + direction + banished) % banished))
    }, [banished])

    if (phase !== 'won' && phase !== 'lost') return null

    const again = () =>
    {
        setOpen(null)
        startMusic()
        start()
    }

    return (
        <div className = { `title-screen end-screen ${won ? 'win' : 'lose'}` }>
            <Embers />

            <header className = "title-top">
                <p className = "title-kicker">{ won ? 'The hunt is over' : 'The hunt is not over' }</p>
                <h1 className = "title-logo">
                    <span className = "title-hallowed">{ won ? 'Banished' : 'Defeated' }</span>
                    <span className = { `title-hunt ${won ? 'jade' : 'dusk'}` }>
                        { banished } of { ghosts.length }
                    </span>
                </h1>
                <p className = "title-ribbon">
                    { won ? 'The ground is hallowed once more.' : 'Rest, then hunt again.' }
                </p>
            </header>

            <footer className = "title-bottom">
                <div
                    className = "end-hearts"
                    role = "img"
                    aria-label = { `${hearts} of ${MAX_HEARTS} hearts left` }
                >
                    { Array.from({ length: MAX_HEARTS }, (_, i) => (
                        <span key = { i } className = { i < hearts ? '' : 'lost' }>{ i < hearts ? '♥' : '♡' }</span>
                    )) }
                </div>

                <ul className = "title-lineup" aria-label = "Ghosts you faced">
                    { ghosts.map((g, i) => (
                        <li key = { g.id }>
                            { i < banished ? (
                                <button className = "tag done" onClick = { () => setOpen(i) } aria-label = { `Open ${g.name} card` }>
                                    <strong>{ g.name }</strong>
                                    <span>Banished</span>
                                </button>
                            ) : (
                                <div className = "tag missed">
                                    <strong>{ g.name }</strong>
                                    <span>{ g.region }</span>
                                </div>
                            ) }
                        </li>
                    )) }
                </ul>

                { banished > 0 && <p className = "title-hint end-hint">Click a banished ghost to see its card</p> }

                <button className = "title-start" onClick = { again } autoFocus>
                    <span className = "title-start-arrow">▶</span> { won ? 'Hunt again' : 'Try again' }
                </button>
            </footer>

            { open !== null && open < banished && (
                <GhostCard
                    ghost = { ghosts[open] }
                    position = { open }
                    total = { banished }
                    onClose = { close }
                    onStep = { step }
                />
            ) }
        </div>
    )
}
