import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useIdle } from './useIdle'
import { useReaction } from './useReaction'

const TOWARD_EXORCIST: [number, number, number] = [-1, 0, 0.15]

export default function Ghost({ id, hidden = false }: { id: string; hidden?: boolean })
{
    const { scene } = useGLTF(`./models/ghosts/${id}.glb`)

    const { position, rotationY } = useControls('Ghost',
    {
        position:
        {
            value: { x: 0, y: 0, z: 0 },
            min: -10,
            max: 10,
            step: 0.01
        },
        rotationY:
        {
            value: -1.00,
            min: -Math.PI,
            max: Math.PI,
            step: 0.01
        },
    })

    const ref = useIdle(scene)
    useReaction(ref, TOWARD_EXORCIST)

    useEffect(() =>
    {
        scene.traverse((child) => { child.castShadow = true })
    }, [scene])

    return (
        <group ref = { ref } visible = { !hidden }>
            <primitive
                object = { scene }
                position = { [position.x, position.y, position.z] }
                rotation-y = { rotationY }
            />
        </group>
    )
}