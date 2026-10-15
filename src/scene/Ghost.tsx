import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'

export default function Ghost({ id }: { id: string })
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

    useEffect(() =>
    {
        scene.traverse((child) => { child.castShadow = true })
    }, [scene])

    return (
        <primitive
            object = { scene }
            position = { [position.x, position.y, position.z] }
            rotation-y = { rotationY }
        />
    )
}