import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, Clone, useGLTF } from '@react-three/drei'
import type { Group } from 'three'
import type { GhostData } from '../data/types'
import './ui.css'

function Portrait({ id }: { id: string })
{
    const { scene } = useGLTF(`./models/ghosts/${id}.glb`)
    const ref = useRef<Group>(null)

    useFrame(({ clock }) =>
    {
        if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.8) * 0.6
    })

    return (
        <Bounds fit clip margin = { 1.25 }>
            <group ref = { ref }>
                <Clone object = { scene } />
            </group>
        </Bounds>
    )
}

interface Props
{
    ghost: GhostData
    position: number
    total: number
    onClose: () => void
    onStep: (direction: -1 | 1) => void
}

export default function GhostCard({ ghost, position, total, onClose, onStep }: Props)
{
    useEffect(() =>
    {
        const onKey = (e: KeyboardEvent) =>
        {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') onStep(-1)
            if (e.key === 'ArrowRight') onStep(1)
        }

        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose, onStep])

    const weaknesses = ghost.fatal.map((f) => f.keys[0])

    return (
        <div className = "card-backdrop" onClick = { onClose }>
            <article
                className = "paper ghost-card"
                role = "dialog"
                aria-modal = "true"
                aria-label = { `${ghost.name} card` }
                onClick = { (e) => e.stopPropagation() }
            >
                <header className = "card-head">
                    <h2>{ ghost.name }</h2>
                    <p>{ ghost.region }</p>
                </header>

                <div className = "card-portrait">
                    <Canvas dpr = { [1, 2] } camera = {{ position: [0, 1, 6], fov: 30 }}>
                        <ambientLight intensity = { 1.4 } />
                        <directionalLight position = { [3, 5, 5] } intensity = { 2.2 } />
                        <directionalLight position = { [-4, 2, -3] } intensity = { 1.2 } color = "#9A6BFF" />
                        <Suspense fallback = { null }>
                            <Portrait key = { ghost.id } id = { ghost.id } />
                        </Suspense>
                    </Canvas>
                </div>

                <section className = "card-section">
                    <h3>Weakness</h3>
                    <ul className = "card-chips">
                        { weaknesses.map((w) => <li key = { w } className = "chip">{ w }</li>) }
                    </ul>
                </section>

                <section className = "card-section">
                    <h3>Ghost Book</h3>
                    <ol className = "card-clues">
                        { ghost.clues.map((clue) => <li key = { clue }>{ clue }</li>) }
                    </ol>
                </section>

                <footer className = "card-nav">
                    <button className = "btn" onClick = { () => onStep(-1) } aria-label = "Previous ghost">‹</button>
                    <span className = "card-count">{ position + 1 } / { total }</span>
                    <button className = "btn" onClick = { () => onStep(1) } aria-label = "Next ghost">›</button>
                    <button className = "btn card-close" onClick = { onClose }>Close</button>
                </footer>
            </article>
        </div>
    )
}
