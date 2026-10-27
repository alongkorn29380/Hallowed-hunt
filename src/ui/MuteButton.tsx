import { useState } from 'react'
import { isMuted, setMuted } from '../audio/music'
import './ui.css'

export default function MuteButton()
{
    const [muted, setMutedState] = useState(isMuted)

    const toggle = () =>
    {
        setMuted(!muted)
        setMutedState(!muted)
    }

    return (
        <button
            className = "paper mute-btn"
            onClick = { toggle }
            aria-pressed = { muted }
            aria-label = { muted ? 'Turn music on' : 'Turn music off' }
        >
            { muted ? '♪ Off' : '♪ On' }
        </button>
    )
}
