// src/ui/DialogBox.tsx
import { useState, type FormEvent } from 'react'
import { useGame } from '../game/store'
import type { Verdict } from '../game/judge'

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
    const start = useGame((s) => s.start)
    const next = useGame((s) => s.next)
    const shatterDone = useGame((s) => s.shatterDone)
    const [text, setText] = useState('')

    const last = attempts[attempts.length - 1]

    if (phase === 'title') return <button onClick = { start }>Start</button>

    if (phase === 'ghostDown') {
        return (
            <>
                <p>{ last ? MESSAGES[last.verdict] : '' }</p>
                <button onClick = { next } disabled = { !shatterDone }>Next</button>
            </>
        )
    }

    if (phase === 'won') {
        return (
            <>
                <p>You won!</p>
                <button onClick = { start }>Play again</button>
            </>
        )
    }

    if (phase === 'lost') {
        return (
            <>
                <p>Game over</p>
                <button onClick = { start }>Try again</button>
            </>
        )
    }

    const onSubmit = (e: FormEvent) =>
    {
        e.preventDefault()
        submit(text)
        setText('')
    }

    return (
        <form onSubmit = { onSubmit }>
            <p>{ last ? MESSAGES[last.verdict] : 'A ghost appears!' }</p>
            <label htmlFor = "answer">What will you use? </label>
            <input
                id = "answer"
                value = { text }
                onChange = { (e) => setText(e.target.value) }
                autoComplete = "off"
            />
            <button type = "submit">Use</button>
        </form>
    )
}