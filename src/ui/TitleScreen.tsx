import { ghosts } from '../data/ghosts'
import { MAX_HEARTS, useGame } from '../game/store'
import './ui.css'

const EMBERS = 16

// Deterministic spread so the render stays pure (no Math.random)
const embers = Array.from({ length: EMBERS }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    delay: (i * 0.9) % 7,
    duration: 6 + (i * 5) % 6,
    size: 3 + (i % 3) * 2,
}))

export default function TitleScreen()
{
    const phase = useGame((s) => s.phase)
    const start = useGame((s) => s.start)

    if (phase !== 'title') return null

    return (
        <div className = "title-screen">
            <div className = "embers" aria-hidden = "true">
                { embers.map((e, i) => (
                    <span
                        key = { i }
                        style = {{
                            left: `${e.left}%`,
                            width: e.size,
                            height: e.size,
                            animationDelay: `${e.delay}s`,
                            animationDuration: `${e.duration}s`,
                        }}
                    />
                )) }
            </div>

            <header className = "title-top">
                <p className = "title-kicker">A ghost-hunting battle</p>
                <h1 className = "title-logo">
                    <span className = "title-hallowed">Hallowed</span>
                    <span className = "title-hunt">Hunt</span>
                </h1>
                <p className = "title-ribbon">Type the weakness. Banish the ghost.</p>
            </header>

            <footer className = "title-bottom">
                <ul className = "title-lineup" aria-label = "Ghosts you will face">
                    { ghosts.map((g) => (
                        <li key = { g.id } className = "tag">
                            <strong>{ g.name }</strong>
                            <span>{ g.region }</span>
                        </li>
                    )) }
                </ul>

                <button className = "title-start" onClick = { start } autoFocus>
                    <span className = "title-start-arrow">▶</span> Start
                </button>
                <p className = "title-hint">
                    Press Enter · { MAX_HEARTS } hearts · banish a ghost to win one back · wrong answers reveal clues
                </p>
            </footer>
        </div>
    )
}
