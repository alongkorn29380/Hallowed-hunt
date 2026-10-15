import { Canvas } from "@react-three/fiber"
import { OrbitControls } from '@react-three/drei'
import { Leva } from "leva"

import Experience from "./scene/Experience"
import Light from "./scene/Light"
import CameraRig from "./scene/CameraRig"
import RetroPass from "./scene/RetroPass"

const DEBUG_CAMERA = false

export default function App()
{
  return (
    <>
      <Leva collapsed />
      <Canvas
        shadows
        dpr = {[1, 1.5]}
        camera = {{
          fov: 40,
          near: 0.1,
          far: 100,
          position: [-0.5, 2.75, 6]
        }}
      >
        <Light />
        <Experience />
        <RetroPass />
        {DEBUG_CAMERA
          ? <OrbitControls target = { [-0.5, 1, 0] } />
          : <CameraRig />}
      </Canvas>
    </>
  )
}