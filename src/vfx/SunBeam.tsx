import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, DoubleSide, type Group, type MeshBasicMaterial } from 'three'
import { useGame } from '../game/store'
import { useShake } from '../scene/CameraRig'

const POSITION: [number, number, number] = [5, 0.8, 1]
const HEIGHT = 14
const OUTER_RADIUS = 0.9
const CORE_RADIUS = 0.35

const GROW = 0.25
const HIT = 0.6
const FADE_START = 0.9
const LIFE = 1.4
const MAX_DT = 0.05

const COLOR = '#fff1b0'

export default function SunBeam()
{
    const group = useRef<Group>(null)
    const core = useRef<MeshBasicMaterial>(null)
    const outer = useRef<MeshBasicMaterial>(null)
    const age = useRef(0)
    const hit = useRef(false)
    const done = useRef(false)

    useFrame((_, delta) =>
    {
        const g = group.current
        if (!g || done.current) return

        age.current += Math.min(delta, MAX_DT)
        const t = age.current

        const grow = Math.min(t / GROW, 1)
        const width = 1 - (1 - grow) * (1 - grow)
        const fade = t < FADE_START ? 1 : Math.max(0, 1 - (t - FADE_START) / (LIFE - FADE_START))
        const flicker = 0.85 + 0.15 * Math.sin(t * 60)

        g.scale.set(width, 1, width)
        if (core.current) core.current.opacity = 0.9 * fade * flicker
        if (outer.current) outer.current.opacity = 0.35 * fade * flicker

        if (!hit.current && t >= HIT) {
            hit.current = true
            useShake.getState().add(0.5)
            useGame.getState().setImpact(true)
        }

        if (t >= LIFE) {
            done.current = true
            g.visible = false
        }
    })

    return (
        <group ref = { group } position = { POSITION }>
            <mesh position-y = { HEIGHT / 2 }>
                <cylinderGeometry args = { [OUTER_RADIUS, OUTER_RADIUS, HEIGHT, 16, 1, true] } />
                <meshBasicMaterial
                    ref = { outer }
                    color = { COLOR }
                    transparent
                    opacity = { 0 }
                    depthWrite = { false }
                    blending = { AdditiveBlending }
                    side = { DoubleSide }
                />
            </mesh>
            <mesh position-y = { HEIGHT / 2 }>
                <cylinderGeometry args = { [CORE_RADIUS, CORE_RADIUS, HEIGHT, 12, 1, true] } />
                <meshBasicMaterial
                    ref = { core }
                    color = "#ffffff"
                    transparent
                    opacity = { 0 }
                    depthWrite = { false }
                    blending = { AdditiveBlending }
                    side = { DoubleSide }
                />
            </mesh>
        </group>
    )
}
