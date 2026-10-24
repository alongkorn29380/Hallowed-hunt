import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../game/store'
import {
    Color,
    Matrix4,
    Quaternion,
    Vector3,
    type InstancedMesh,
    type Object3D,
} from 'three'

const GRAVITY = -9
const LIFE = 2.2
const FADE_START = 1.4
const MAX_DT = 0.05

const _m = new Matrix4()
const _q = new Quaternion()
const _s = new Vector3()

export default function VoxelShatter({ scene, floorY = 0 }: { scene: Object3D; floorY?: number })
{
    const ref = useRef<InstancedMesh>(null)
    const age = useRef(0)

    const { positions, velocities, colors, size } = useMemo(() =>
    {
        // matrixWorld includes the platform and the Leva offset; visibility does not matter
        scene.updateWorldMatrix(true, true)

        // voxelSize and palette live on the model's root node, not on the glTF scene group
        let size = 0.1
        let palette: string[] = []
        scene.traverse((node) =>
        {
            if (node.userData.voxelSize === undefined) return
            size = node.userData.voxelSize as number
            palette = node.userData.palette as string[]
        })

        const positions: Vector3[] = []
        const colors: string[] = []

        scene.traverse((node) =>
        {
            const voxels = node.userData.voxels as ArrayLike<number> | undefined
            if (!voxels) return

            for (let i = 0; i < voxels.length; i += 4) {
                const position = new Vector3(voxels[i], voxels[i + 1], voxels[i + 2])
                node.localToWorld(position)
                positions.push(position)
                colors.push(palette[voxels[i + 3]] ?? '#ffffff')
            }
        })

        const center = new Vector3()
        for (const position of positions) center.add(position)
        if (positions.length) center.divideScalar(positions.length)

        const velocities = positions.map((position) =>
        {
            const direction = position.clone().sub(center)
            direction.add(new Vector3(
                (Math.random() - 0.5) * size,
                (Math.random() - 0.5) * size,
                (Math.random() - 0.5) * size,
            ))

            if (direction.lengthSq() === 0) direction.set(0, 1, 0)

            return direction.normalize()
                .multiplyScalar(1.5 + Math.random() * 2)
                .add(new Vector3(0, 2, 0))
        })

        return { positions, velocities, colors, size }
    }, [scene])

    useEffect(() =>
    {
        const mesh = ref.current
        if (!mesh) return

        age.current = 0
        mesh.visible = true

        colors.forEach((color, i) =>
        {
            mesh.setColorAt(i, new Color(color))
            mesh.setMatrixAt(i, _m.identity().setPosition(positions[i]))
        })

        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
        mesh.instanceMatrix.needsUpdate = true
    }, [colors, positions])

    useFrame((_, delta) =>
    {
        const mesh = ref.current
        if (!mesh || !mesh.visible) return

        const dt = Math.min(delta, MAX_DT)
        age.current += dt

        if (age.current >= LIFE) {
            mesh.visible = false
            useGame.getState().setShatterDone(true)
            return
        }

        const fade = age.current < FADE_START
            ? 1
            : 1 - (age.current - FADE_START) / (LIFE - FADE_START)
        _s.setScalar(fade)

        const floor = floorY + size / 2

        for (let i = 0; i < positions.length; i++) {
            const position = positions[i]
            const velocity = velocities[i]

            velocity.y += GRAVITY * dt
            position.addScaledVector(velocity, dt)

            if (position.y < floor) {
                position.y = floor
                velocity.y *= -0.3
                velocity.x *= 0.8
                velocity.z *= 0.8
            }

            mesh.setMatrixAt(i, _m.compose(position, _q, _s))
        }

        mesh.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh
            ref={ref}
            args={[undefined, undefined, positions.length]}
            frustumCulled={false}
            castShadow
        >
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial />
        </instancedMesh>
    )
}
