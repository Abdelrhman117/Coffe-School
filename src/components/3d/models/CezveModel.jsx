import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Decal } from '@react-three/drei'
import * as THREE from 'three'
import useLogoTexture from '../useLogoTexture'

const COPPER = { color: '#b87333', metalness: 0.85, roughness: 0.25, envMapIntensity: 2 }
const DARK_COPPER = { color: '#7a4a1e', metalness: 0.7, roughness: 0.35, envMapIntensity: 1.5 }
const GOLD_TRIM = { color: '#c5a059', metalness: 0.9, roughness: 0.15, envMapIntensity: 2 }

export default function CezveModel({ active }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const logo = useLogoTexture()

  const handleCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.32, 0.1, 0),
      new THREE.Vector3(0.55, 0.3, 0),
      new THREE.Vector3(0.72, 0.6, 0),
      new THREE.Vector3(0.7, 0.9, 0),
      new THREE.Vector3(0.6, 1.05, 0),
    ])
  }, [])

  const spoutCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.28, 0.55, 0),
      new THREE.Vector3(-0.45, 0.65, 0),
      new THREE.Vector3(-0.55, 0.8, 0),
    ])
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = active ? 1 : 0
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, t, delta * 2.8)
    )
    if (active) {
      groupRef.current.rotation.y += delta * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.75) * 0.1
    }
  })

  return (
    <group ref={groupRef} scale={0} rotation={[0.1, -0.3, 0]}>
      {/* Main body — slightly tapered cylinder */}
      <mesh ref={bodyRef} position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.35, 0.7, 64, 3]} />
        <meshStandardMaterial {...COPPER} />
        {/* Coffee School logo on front */}
        <Decal
          position={[0, 0, 0.36]}
          rotation={[0, 0, 0]}
          scale={[0.42, 0.21, 0.1]}
          map={logo}
          depthTest={false}
          polygonOffsetFactor={-10}
        />
      </mesh>

      {/* Neck — narrows above body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.28, 0.2, 64]} />
        <meshStandardMaterial {...DARK_COPPER} />
      </mesh>

      {/* Gold neck ring */}
      <mesh position={[0, 0.56, 0]} castShadow>
        <torusGeometry args={[0.17, 0.025, 8, 64]} />
        <meshStandardMaterial {...GOLD_TRIM} />
      </mesh>

      {/* Flared rim at top */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.155, 0.08, 64]} />
        <meshStandardMaterial {...COPPER} />
      </mesh>

      {/* Bottom base disc */}
      <mesh position={[0, -0.37, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.33, 0.06, 64]} />
        <meshStandardMaterial {...GOLD_TRIM} />
      </mesh>

      {/* Curved handle */}
      <mesh castShadow>
        <tubeGeometry args={[handleCurve, 24, 0.045, 8, false]} />
        <meshStandardMaterial {...DARK_COPPER} />
      </mesh>

      {/* Curved spout */}
      <mesh castShadow>
        <tubeGeometry args={[spoutCurve, 16, 0.04, 8, false]} />
        <meshStandardMaterial {...COPPER} />
      </mesh>
    </group>
  )
}
