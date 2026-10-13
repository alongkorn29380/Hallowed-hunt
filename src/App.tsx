import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Leva } from 'leva'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import Experience from './scene/Experience'

export default function App() {
  const controls = useRef<OrbitControlsImpl>(null)

  const logCamera = () => {
    const c = controls.current
    if (!c) return
    console.log('camera', c.object.position.toArray(), 'target', c.target.toArray())
  }

  return (
    <>
      <Leva collapsed />
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ fov: 40, near: 0.1, far: 100, position: [-0.5, 2.75, 6] }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
        <OrbitControls ref={controls} target={[-0.5, 1, 0]} onEnd={logCamera} />
      </Canvas>
    </>
  )
}