import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Decal } from '@react-three/drei'
import * as THREE from 'three'
import useLogoTexture from '../useLogoTexture'

const GLASS = {
  color: '#0a1628',
  metalness: 0.05,
  roughness: 0.02,
  transparent: true,
  opacity: 0.88,
  envMapIntensity: 3,
}
const GLASS_BODY = { ...GLASS, color: '#0d1f3c', opacity: 0.82 }
const CAP_METAL = { color: '#2a2a2a', metalness: 0.95, roughness: 0.08 }
const GOLD_TRIM = { color: '#c5a059', metalness: 0.9, roughness: 0.12, envMapIntensity: 2 }
const LABEL_MAT = { color: '#f5f0e8', metalness: 0, roughness: 0.9 }

export default function BottleModel({ active }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const logo = useLogoTexture()

  // Label texture: "1883" drawn on canvas
  const labelTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512; canvas.height = 512
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f5f0e8'
    ctx.fillRect(0, 0, 512, 512)
    ctx.fillStyle = '#0a1628'
    ctx.textAlign = 'center'
    ctx.font = 'bold 120px Georgia, serif'
    ctx.fillText('1883', 256, 180)
    ctx.font = 'bold 36px Arial'
    ctx.fillText('SIROP DE CANNE', 256, 240)
    ctx.font = '28px Arial'
    ctx.fillStyle = '#c5a059'
    ctx.fillText('Coffee School', 256, 310)
    ctx.fillText('Exclusive Import', 256, 350)
    ctx.strokeStyle = '#c5a059'
    ctx.lineWidth = 4
    ctx.strokeRect(24, 24, 464, 464)
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = active ? 1 : 0
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, t, delta * 2.8)
    )
    if (active) {
      groupRef.current.rotation.y += delta * 0.28
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.85) * 0.1
    }
  })

  return (
    <group ref={groupRef} scale={0} rotation={[0.05, 0, 0]}>
      {/* === Main bottle body === */}
      <mesh ref={bodyRef} position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.3, 1.2, 64, 2]} />
        <meshStandardMaterial {...GLASS_BODY} />
      </mesh>

      {/* Label panel on body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.282, 0.302, 0.75, 64, 1, false, -Math.PI * 0.55, Math.PI * 1.1]} />
        <meshStandardMaterial map={labelTexture} roughness={0.8} metalness={0} />
      </mesh>

      {/* Shoulder taper */}
      <mesh position={[0, 0.73, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.28, 0.32, 64]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.22, 32]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>

      {/* Gold neck band */}
      <mesh position={[0, 1.08, 0]} castShadow>
        <torusGeometry args={[0.11, 0.018, 8, 64]} />
        <meshStandardMaterial {...GOLD_TRIM} />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.115, 0.11, 0.1, 32]} />
        <meshStandardMaterial {...CAP_METAL} />
      </mesh>
      <mesh position={[0, 1.21, 0]} castShadow>
        <sphereGeometry args={[0.115, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial {...CAP_METAL} />
      </mesh>

      {/* Bottom base ring */}
      <mesh position={[0, -0.62, 0]} castShadow>
        <cylinderGeometry args={[0.31, 0.3, 0.04, 64]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>

      {/* Subtle gold base ring */}
      <mesh position={[0, -0.65, 0]} castShadow>
        <torusGeometry args={[0.3, 0.01, 8, 64]} />
        <meshStandardMaterial {...GOLD_TRIM} />
      </mesh>

      {/* Coffee School Decal on back of bottle */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.284, 0.304, 0.45, 64, 1, false, Math.PI * 0.55, Math.PI * 0.9]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} metalness={0} />
        <Decal
          position={[0, 0, -0.302]}
          rotation={[0, Math.PI, 0]}
          scale={[0.38, 0.2, 0.08]}
          map={logo}
          depthTest={false}
          polygonOffsetFactor={-10}
        />
      </mesh>
    </group>
  )
}
