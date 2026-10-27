// src/ui/DialogBox.tsx
import { useState, type FormEvent } from 'react'
import { useGame } from '../game/store'
import type { Verdict } from '../game/judge'
import './ui.css'

const MESSAGES: Record<Verdict, string> = {
    fatal: "It's super effective!",
    partial: 'It had a little effect...',
    wrong: 'It had no effect.',
    empty: '',
}

export default function DialogBox()
{
    const phase = useGame((s) => s.phase)
    const attempts = useGame((s) => s.attempts)
    const submit = useGame((s) => s.submit)
    const next = useGame((s) => s.next)
    const shatterDone = useGame((s) => s.shatterDone)
    const [text, setText] = useState('')

    const last = attempts[attempts.length - 1]

    // title, win and lose have their own full-screen views
    if (phase === 'title' || phase === 'won' || phase === 'lost') return null

    if (phase === 'ghostDown') {
        return (
            <div className = "paper dialog">
                <p className = "dialog-text" aria-live = "polite">{ last ? MESSAGES[last.verdict] : '' }</p>
                <button className = "btn" onClick = { next } disabled = { !shatterDone }>Next</button>
            </div>
        )
    }

    const onSubmit = (e: FormEvent) =>
    {
        e.preventDefault()
        submit(text)
        setText('')
    }

    return (
        <form className = "paper dialog" onSubmit = { onSubmit }>
            <p className = "dialog-text" aria-live = "polite">{ last ? MESSAGES[last.verdict] : 'A ghost appears!' }</p>
            <div className = "dialog-row">
                <label className = "dialog-label" htmlFor = "answer">What will you use?</label>
                <input
                    id = "answer"
                    className = "answer-input"
                    value = { text }
                    onChange = { (e) => setText(e.target.value) }
                    autoComplete = "off"
                    autoFocus
                />
                <button className = "btn" type = "submit">Use</button>
            </div>
        </form>
    )
}
