import './ui.css'

const EMBERS = 16

const embers = Array.from({ length: EMBERS }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    delay: (i * 0.9) % 7,
    duration: 6 + (i * 5) % 6,
    size: 3 + (i % 3) * 2,
}))

export default function Embers()
{
    return (
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
    )
}
