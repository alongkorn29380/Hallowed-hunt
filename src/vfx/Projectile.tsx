import { useRef, type ComponentType } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, type Group } from 'three'
import { useGame } from '../game/store'
import { useShake } from '../scene/CameraRig'

const START = new Vector3(-1.4, 1.3, 2)
const END = new Vector3(5, 1.6, 1)
const DELTA = END.clone().sub(START)

const DURATION = 0.9
const ARC = 0.5
const MAX_DT = 0.05

function Part({ size, x = 0, y = 0, z = 0, color, glow = 1.2 }: { size: [number, number, number]; x?: number; y?: number; z?: number; color: string; glow?: number })
{
    return (
        <mesh position = { [x, y, z] } castShadow>
            <boxGeometry args = { size } />
            <meshStandardMaterial color = { color } emissive = { color } emissiveIntensity = { glow } />
        </mesh>
    )
}

// Every shape points along +x, the direction of flight.
function Bullet()
{
    return (
        <>
            <Part size = { [0.28, 0.12, 0.12] } x = { -0.06 } color = "#dfe6ff" />
            <Part size = { [0.1, 0.08, 0.08] } x = { 0.15 } color = "#ffffff" glow = { 2 } />
        </>
    )
}

function Stake()
{
    return (
        <>
            <Part size = { [0.7, 0.1, 0.1] } color = "#8a5a2b" glow = { 0.5 } />
            <Part size = { [0.15, 0.06, 0.06] } x = { 0.42 } color = "#e0c090" glow = { 0.8 } />
        </>
    )
}

function Talisman()
{
    return (
        <>
            <Part size = { [0.32, 0.5, 0.03] } color = "#ffd84a" glow = { 1.4 } />
            <Part size = { [0.14, 0.3, 0.035] } color = "#c0302a" glow = { 0.8 } />
        </>
    )
}

function Beans()
{
    return (
        <>
            <Part size = { [0.12, 0.12, 0.12] } x = { -0.1 } y = { 0.05 } color = "#d9b36a" />
            <Part size = { [0.12, 0.12, 0.12] } x = { 0.05 } y = { -0.06 } z = { 0.05 } color = "#e6c27e" />
            <Part size = { [0.12, 0.12, 0.12] } x = { 0.12 } y = { 0.07 } z = { -0.05 } color = "#cfa45a" />
        </>
    )
}

function Thorns()
{
    return (
        <>
            <Part size = { [0.6, 0.07, 0.07] } color = "#5a4630" glow = { 0.4 } />
            <Part size = { [0.08, 0.14, 0.04] } x = { -0.15 } y = { 0.08 } color = "#c8c0a0" glow = { 0.9 } />
            <Part size = { [0.08, 0.14, 0.04] } x = { 0.05 } y = { -0.08 } color = "#c8c0a0" glow = { 0.9 } />
            <Part size = { [0.08, 0.14, 0.04] } x = { 0.22 } y = { 0.08 } color = "#c8c0a0" glow = { 0.9 } />
        </>
    )
}

// A C-shaped horseshoe, open toward the direction of flight
function Horseshoe()
{
    return (
        <>
            <Part size = { [0.07, 0.31, 0.07] } x = { -0.12 } color = "#9aa5b5" glow = { 0.9 } />
            <Part size = { [0.3, 0.07, 0.07] } x = { 0.02 } y = { 0.12 } color = "#9aa5b5" glow = { 0.9 } />
            <Part size = { [0.3, 0.07, 0.07] } x = { 0.02 } y = { -0.12 } color = "#9aa5b5" glow = { 0.9 } />
        </>
    )
}

function Cube()
{
    return <Part size = { [0.3, 0.3, 0.3] } color = "#ffffff" />
}

interface Look
{
    Shape: ComponentType
    spin: [number, number, number]
    glow: string
}

const LOOKS: Record<string, Look> = {
    werewolf: { Shape: Bullet, spin: [20, 0, 0], glow: '#dfe6ff' },
    dracula: { Shape: Stake, spin: [0, 0, 0], glow: '#b07a3c' },
    jiangshi: { Shape: Talisman, spin: [14, 0, 0], glow: '#ffd84a' },
    oni: { Shape: Beans, spin: [9, 12, 0], glow: '#e6c27e' },
    krasue: { Shape: Thorns, spin: [6, 0, 0], glow: '#c8c0a0' },
    fairy: { Shape: Horseshoe, spin: [0, 0, 10], glow: '#9aa5b5' },
}
const FALLBACK: Look = { Shape: Cube, spin: [12, 9, 0], glow: '#ffffff' }

// Flies from the exorcist to the ghost, then tells the store it hit.
// The outer group is placed once; useFrame only moves the inner group.
export default function Projectile({ id }: { id: string })
{
    const ref = useRef<Group>(null)
    const age = useRef(0)
    const done = useRef(false)

    const { Shape, spin, glow } = LOOKS[id] ?? FALLBACK

    useFrame((_, delta) =>
    {
        const group = ref.current
        if (!group || done.current) return

        age.current += Math.min(delta, MAX_DT)
        const p = Math.min(age.current / DURATION, 1)

        group.position.copy(DELTA).multiplyScalar(p)
        group.position.y += Math.sin(Math.PI * p) * ARC
        group.rotation.x += delta * spin[0]
        group.rotation.y += delta * spin[1]
        group.rotation.z += delta * spin[2]

        if (p >= 1) {
            done.current = true
            group.visible = false
            useShake.getState().add(0.4)
            useGame.getState().setImpact(true)
        }
    })

    return (
        <group position = { START }>
            <group ref = { ref }>
                <Shape />
                <pointLight color = { glow } intensity = { 3 } distance = { 4 } decay = { 2 } />
            </group>
        </group>
    )
}
