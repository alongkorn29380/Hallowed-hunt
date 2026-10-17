import { ghosts } from '../data/ghosts'
import { MAX_HEARTS, useGame } from '../game/store'

export default function BattleHUD()
{
    const phase = useGame((s) => s.phase)
    const hearts = useGame((s) => s.hearts)
    const ghostIndex = useGame((s) => s.ghostIndex)
    const clues = useGame((s) => s.clues)

    if (phase === 'title') return null

    const ghost = ghosts[ghostIndex]

    return (
        <section style = {{ position: 'fixed', top: 16, left: 16, color: 'white', maxWidth: 360 }}>
            <h1>{ ghost.name }</h1>
            <p>{ ghost.region } · Ghost { ghostIndex + 1 } of { ghosts.length }</p>

            <div aria-label = "Hearts">
                { Array.from({ length: MAX_HEARTS }, (_, i) => (
                    <span key = { i }>{ i < hearts ? '♥' : '♡' }</span>
                )) }
            </div>

            <h2>Ghost Book</h2>
            <ul>
                { ghost.clues.slice(0, clues).map((clue) => <li key = { clue }>{ clue }</li>) }
                { Array.from({ length: ghost.clues.length - clues }, (_, i) => (
                    <li key = { i }>🔒 Locked</li>
                )) }
            </ul>
        </section>
    )
}