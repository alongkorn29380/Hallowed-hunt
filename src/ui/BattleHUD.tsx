import { ghosts } from '../data/ghosts'
import { ghostHp } from '../game/ghostHp'
import { MAX_HEARTS, useGame } from '../game/store'
import './ui.css'

export default function BattleHUD()
{
    const phase = useGame((s) => s.phase)
    const hearts = useGame((s) => s.hearts)
    const ghostIndex = useGame((s) => s.ghostIndex)
    const clues = useGame((s) => s.clues)
    const attempts = useGame((s) => s.attempts)

    if (phase === 'title') return null

    const ghost = ghosts[ghostIndex]
    const hp = ghostHp(attempts)
    const hpLevel = hp > 0.5 ? 'high' : hp > 0.25 ? 'mid' : 'low'

    return (
        <section className = "paper hud">
            <h1 className = "hud-name">{ ghost.name }</h1>
            <p className = "hud-sub">{ ghost.region } · Ghost { ghostIndex + 1 } of { ghosts.length }</p>

            <div className = "hp" role = "img" aria-label = { `Ghost health ${Math.round(hp * 100)} percent` }>
                <span className = "hp-label">HP</span>
                <div className = "hp-track">
                    <div className = { `hp-fill ${hpLevel}` } style = {{ width: `${hp * 100}%` }} />
                </div>
            </div>

            <div className = "hearts" role = "img" aria-label = { `${hearts} of ${MAX_HEARTS} hearts left` }>
                { Array.from({ length: MAX_HEARTS }, (_, i) => (
                    <span key = { i } className = { i < hearts ? '' : 'lost' }>{ i < hearts ? '♥' : '♡' }</span>
                )) }
            </div>

            <h2 className = "book-title">Ghost Book</h2>
            <ul className = "clues">
                { ghost.clues.slice(0, clues).map((clue, i) => (
                    <li key = { clue } className = { i === clues - 1 ? 'clue fresh' : 'clue' }>{ clue }</li>
                )) }
                { Array.from({ length: ghost.clues.length - clues }, (_, i) => (
                    <li key = { i } className = "clue locked">🔒 Locked</li>
                )) }
            </ul>
        </section>
    )
}
