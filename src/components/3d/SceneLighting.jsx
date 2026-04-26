import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../store/useStore'

// One color per product section (index matches products array order)
const SECTION_COLORS = [
  new THREE.Color('#f97316'), // Barista Course    → Warm Orange
  new THREE.Color('#92510a'), // Turkish Coffee    → Deep Copper
  new THREE.Color('#3b82f6'), // Syrup 1883        → Electric Blue
  new THREE.Color('#c5a059'), // Elite Espresso    → Antique Gold
]

const FILL_COLORS = [
  new THREE.Color('#7c2d12'), // orange fill
  new THREE.Color('#451a03'), // brown fill
  new THREE.Color('#1e3a8a'), // blue fill
  new THREE.Color('#78350f'), // gold fill
]

export default function SceneLighting() {
  const keyLightRef = useRef()
  const fillLightRef = useRef()
  const rimLightRef = useRef()

  const currentKey = useRef(new THREE.Color('#c5a059'))
  const currentFill = useRef(new THREE.Color('#78350f'))
  const activeSection = useStore((s) => s.activeSection)

  useFrame((_, delta) => {
    const speed = delta * 1.8
    const targetKey = SECTION_COLORS[activeSection] ?? SECTION_COLORS[0]
    const targetFill = FILL_COLORS[activeSection] ?? FILL_COLORS[0]

    currentKey.current.lerp(targetKey, speed)
    currentFill.current.lerp(targetFill, speed)

    if (keyLightRef.current) keyLightRef.current.color.copy(currentKey.current)
    if (fillLightRef.current) fillLightRef.current.color.copy(currentFill.current)
  })

  return (
    <>
      {/* Ambient base — stays neutral */}
      <ambientLight intensity={0.25} color="#1a1208" />

      {/* Key light — color shifts per section */}
      <directionalLight
        ref={keyLightRef}
        position={[4, 8, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fill light — complementary color from below/side */}
      <pointLight
        ref={fillLightRef}
        position={[-4, -3, 2]}
        intensity={1.2}
        distance={12}
      />

      {/* Rim light — always warm gold, from behind */}
      <pointLight
        ref={rimLightRef}
        position={[0, 2, -5]}
        intensity={0.8}
        color="#c5a059"
        distance={15}
      />

      {/* Top specular highlight */}
      <spotLight
        position={[0, 10, 0]}
        intensity={1}
        angle={0.3}
        penumbra={0.8}
        color="#ffffff"
      />
    </>
  )
}
