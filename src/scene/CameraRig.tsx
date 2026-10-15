// src/scene/CameraRig.tsx
import { useFrame } from '@react-three/fiber'
import { create } from 'zustand'
import { useControls } from 'leva'

export const useShake = create<{ trauma: number; add: (n: number) => void }>((set) => ({
    trauma: 0,
    add: (n) => set((s) => ({ trauma: Math.min(1, s.trauma + n) })),
}))

export default function CameraRig()
{
    const { position, target } = useControls('Camera', {
        position: 
        { 
            value: { x: -1.78, y: 3.95, z: 9.92 }, 
            min: -20, 
            max: 20, 
            step: 0.01 
        },
        target: 
        { 
            value: { x: 1.16, y: 0.44, z: -0.4 }, 
            min: -20, 
            max: 20, 
            step: 0.01 
        },
    })

    useFrame(({ camera, clock }, dt) =>
    {
        const t = clock.elapsedTime
        const trauma = useShake.getState().trauma
        const s = trauma * trauma

        camera.position.set(
            position.x + Math.sin(t * 1.1) * 0.05 + (Math.random() - 0.5) * s * 0.4,
            position.y + Math.sin(t * 0.8) * 0.03 + (Math.random() - 0.5) * s * 0.4,
            position.z,
        )
        camera.lookAt(target.x, target.y, target.z)

        useShake.setState({ trauma: Math.max(0, trauma - dt * 1.5) })
    })

    return null
}