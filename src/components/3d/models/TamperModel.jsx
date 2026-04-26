import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Decal } from '@react-three/drei'
import * as THREE from 'three'
import useLogoTexture from '../useLogoTexture'

const CHROME = { color: '#d8d8d8', metalness: 0.95, roughness: 0.08, envMapIntensity: 2 }
const DARK_CHROME = { color: '#1a1a1a', metalness: 0.9, roughness: 0.15, envMapIntensity: 1.5 }
const ACCENT = { color: '#c5a059', metalness: 0.8, roughness: 0.2, envMapIntensity: 1.5 }

export default function TamperModel({ active }) {
  const groupRef = useRef()
  const handleRef = useRef()
  const logo = useLogoTexture()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = active ? 1 : 0
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, t, delta * 2.8)
    )
    if (active) {
      groupRef.current.rotation.y += delta * 0.35
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.1
    }
  })

  return (
    <group ref={groupRef} scale={0} rotation={[0.15, 0, 0]}>
      {/* Ergonomic handle top */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.21, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>

      {/* Handle body — main grip with logo */}
      <mesh ref={handleRef} position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.23, 1.4, 64, 1]} />
        <meshStandardMaterial {...DARK_CHROME} />
        {/* Logo Decal on front of handle */}
        <Decal
          position={[0, 0, 0.24]}
          rotation={[0, 0, 0]}
          scale={[0.36, 0.18, 0.08]}
          map={logo}
          depthTest={false}
          polygonOffsetFactor={-10}
        />
      </mesh>

      {/* Accent ring */}
      <mesh position={[0, -0.36, 0]} castShadow>
        <cylinderGeometry args={[0.235, 0.235, 0.06, 64]} />
        <meshStandardMaterial {...ACCENT} />
      </mesh>

      {/* Connector taper */}
      <mesh position={[0, -0.46, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.42, 0.18, 64]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>

      {/* Base disc — flat tamping surface */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.41, 0.07, 128]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>

      {/* Bottom edge ring */}
      <mesh position={[0, -0.645, 0]} castShadow>
        <torusGeometry args={[0.41, 0.015, 8, 128]} />
        <meshStandardMaterial {...ACCENT} />
      </mesh>
    </group>
  )
}
