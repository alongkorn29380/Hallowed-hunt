import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect } from 'react'

export default function Exorcist()
{
    const { scene } = useGLTF('./models/exorcist.glb')

    const { position, rotationY } = useControls('Exorcist', 
    {
        position: 
        {
            value: {x: 0, y:0, z:0},
            min: -10,
            max: 10,
            step: 0.01
        },
        rotationY:
        {
            value: 2.18,
            min: - Math.PI,
            max: Math.PI,
            step: 0.01
        }
    })

    useEffect(() =>
    {
        scene.traverse((child) => { child.castShadow = true })
    }, [scene])

    return (
        <primitive 
            object = { scene } 
            position = {[position.x, position.y, position.z]}
            rotation-y = { rotationY }
        >
            <pointLight 
                position = {[-0.6, 0.2, 0.1]} 
                color = "#FFB04A" 
                intensity = { 4 } 
                distance = { 5 } 
                decay = { 2 } 
            />
        </primitive>
    )
}