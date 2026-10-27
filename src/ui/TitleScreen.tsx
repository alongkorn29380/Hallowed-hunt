import { startMusic } from '../audio/music'
import { ghosts } from '../data/ghosts'
import { MAX_HEARTS, useGame } from '../game/store'
import Embers from './Embers'
import './ui.css'

export default function TitleScreen()
{
    const phase = useGame((s) => s.phase)
    const start = useGame((s) => s.start)

    if (phase !== 'title') return null

    const onStart = () =>
    {
        startMusic()
        start()
    }

    return (
        <div className = "title-screen">
            <Embers />

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

                <button className = "title-start" onClick = { onStart } autoFocus>
                    <span className = "title-start-arrow">▶</span> Start
                </button>
                <p className = "title-hint">
                    Press Enter · { MAX_HEARTS } hearts · banish a ghost to win one back · wrong answers reveal clues
                </p>
            </footer>
        </div>
    )
}
