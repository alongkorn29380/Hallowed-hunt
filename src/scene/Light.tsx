export default function Light() {
  return (
    <>
      <hemisphereLight args={['#8C7BD6', '#1A1430', 0.7]} />

      <directionalLight
        position={[-5, 8, 6]}
        color="#E6E9FF"
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.001}
        shadow-normalBias={0.03}
        shadow-camera-top={6}
        shadow-camera-right={6}
        shadow-camera-bottom={-6}
        shadow-camera-left={-6}
        shadow-camera-near={1}
        shadow-camera-far={25}
      />

      <directionalLight position={[4, 5, -8]} color="#9A6BFF" intensity={1.5} />
    </>
  )
}