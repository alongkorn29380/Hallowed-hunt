import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Object3D } from 'three'

export function useIdle(scene: Object3D, offset = 0)
{
    const ref = useRef<Group>(null)
    const parts = useRef<{
        head?: Object3D
        armR?: Object3D
        armL?: Object3D
    }>({})

    useEffect(() =>
    {
        parts.current = {
            head: scene.getObjectByName('Head'),
            armR: scene.getObjectByName('ArmR'),
            armL: scene.getObjectByName('ArmL'),
        }
    }, [scene])

    useFrame(({ clock }) =>
    {
        const t = clock.elapsedTime + offset

        if (ref.current)
            ref.current.position.y = Math.sin(t * 2) * 0.05

        const { head, armR, armL } = parts.current
        if (head) head.rotation.z = Math.sin(t) * 0.05
        if (armR) armR.rotation.x = Math.sin(t * 2) * 0.25
        if (armL) armL.rotation.x = -Math.sin(t * 2) * 0.25
    })

    return ref
}