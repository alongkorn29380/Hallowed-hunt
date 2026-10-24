import { useRef } from 'react'
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
const SIZE = 0.35

const COLORS: Record<string, string> = {
    werewolf: '#dfe6ff',
    dracula: '#b07a3c',
    jiangshi: '#ffd84a',
}
const FALLBACK_COLOR = '#ffffff'

// Flies from the exorcist to the ghost, then tells the store it hit.
// The outer group is placed once; useFrame only moves the inner group.
export default function Projectile({ id }: { id: string })
{
    const ref = useRef<Group>(null)
    const age = useRef(0)
    const done = useRef(false)

    const color = COLORS[id] ?? FALLBACK_COLOR

    useFrame((_, delta) =>
    {
        const group = ref.current
        if (!group || done.current) return

        age.current += Math.min(delta, MAX_DT)
        const p = Math.min(age.current / DURATION, 1)

        group.position.copy(DELTA).multiplyScalar(p)
        group.position.y += Math.sin(Math.PI * p) * ARC
        group.rotation.x += delta * 12
        group.rotation.y += delta * 9

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
                <mesh castShadow>
                    <boxGeometry args = { [SIZE, SIZE, SIZE] } />
                    <meshStandardMaterial color = { color } emissive = { color } emissiveIntensity = { 1.5 } />
                </mesh>
                <pointLight color = { color } intensity = { 3 } distance = { 4 } decay = { 2 } />
            </group>
        </group>
    )
}
