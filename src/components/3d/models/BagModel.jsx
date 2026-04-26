import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Decal, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import useLogoTexture from '../useLogoTexture'

const MATTE_BLACK = { color: '#0d0d0d', metalness: 0.15, roughness: 0.85, envMapIntensity: 0.8 }
const FOIL = { color: '#1a1a1a', metalness: 0.6, roughness: 0.3, envMapIntensity: 1.5 }
const GOLD_TRIM = { color: '#c5a059', metalness: 0.85, roughness: 0.2, envMapIntensity: 2 }
const VALVE = { color: '#2a2a2a', metalness: 0.7, roughness: 0.3 }

export default function BagModel({ active }) {
  const groupRef = useRef()
  const frontRef = useRef()
  const logo = useLogoTexture()

  // Front label texture
  const frontLabel = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512; canvas.height = 768
    const ctx = canvas.getContext('2d')

    // Dark gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, 768)
    grad.addColorStop(0, '#1a1a1a')
    grad.addColorStop(0.5, '#0d0d0d')
    grad.addColorStop(1, '#111111')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 768)

    // Gold border
    ctx.strokeStyle = '#c5a059'
    ctx.lineWidth = 6
    ctx.strokeRect(18, 18, 476, 732)
    ctx.lineWidth = 2
    ctx.strokeRect(28, 28, 456, 712)

    // "ELITE" top
    ctx.fillStyle = '#c5a059'
    ctx.textAlign = 'center'
    ctx.font = 'bold 80px Arial, sans-serif'
    ctx.fillText('ELITE', 256, 130)

    // Divider
    ctx.strokeStyle = '#c5a059'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(80, 155); ctx.lineTo(432, 155); ctx.stroke()

    // Coffee School
    ctx.font = 'bold 36px Arial'
    ctx.fillStyle = '#e5d5b0'
    ctx.fillText('Coffee School', 256, 210)

    // Arabic
    ctx.font = '30px Arial'
    ctx.fillStyle = '#c5a059'
    ctx.fillText('مدرسة القهوة', 256, 260)

    // Center divider
    ctx.strokeStyle = 'rgba(197,160,89,0.3)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(60, 285); ctx.lineTo(452, 285); ctx.stroke()

    // Blend label
    ctx.font = 'bold 42px Arial'
    ctx.fillStyle = '#e5d5b0'
    ctx.fillText('ESPRESSO', 256, 360)
    ctx.font = '28px Arial'
    ctx.fillStyle = 'rgba(197,160,89,0.8)'
    ctx.fillText('Premium Blend', 256, 410)

    // Blend ratio
    ctx.font = 'bold 32px Arial'
    ctx.fillStyle = '#c5a059'
    ctx.fillText('80% Arabica · 20% Robusta', 256, 480)

    // Weight
    ctx.font = 'bold 52px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('1 KG', 256, 590)

    // Bottom accent
    ctx.strokeStyle = '#c5a059'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(80, 620); ctx.lineTo(432, 620); ctx.stroke()
    ctx.font = '22px Arial'
    ctx.fillStyle = 'rgba(197,160,89,0.6)'
    ctx.fillText('Dark Roast · Specialty Grade', 256, 660)

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
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  return (
    <group ref={groupRef} scale={0} rotation={[0, 0, 0]}>
      {/* Main bag body */}
      <RoundedBox
        ref={frontRef}
        args={[0.85, 1.25, 0.32]}
        radius={0.035}
        smoothness={4}
        position={[0, 0, 0]}
        castShadow
      >
        <meshStandardMaterial {...MATTE_BLACK} />
        {/* Front label decal */}
        <Decal
          position={[0, -0.04, 0.165]}
          rotation={[0, 0, 0]}
          scale={[0.72, 0.95, 0.12]}
          map={frontLabel}
          depthTest={false}
          polygonOffsetFactor={-10}
        />
        {/* Back logo decal */}
        <Decal
          position={[0, 0.1, -0.165]}
          rotation={[0, Math.PI, 0]}
          scale={[0.55, 0.28, 0.08]}
          map={logo}
          depthTest={false}
          polygonOffsetFactor={-10}
        />
      </RoundedBox>

      {/* Top fold — the characteristic folded top of a coffee bag */}
      <mesh position={[0, 0.69, 0]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.85, 0.2, 0.3]} />
        <meshStandardMaterial {...FOIL} />
      </mesh>
      <mesh position={[0, 0.78, 0.012]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.85, 0.06, 0.28]} />
        <meshStandardMaterial {...MATTE_BLACK} />
      </mesh>

      {/* Gold top edge seal */}
      <mesh position={[0, 0.68, 0.06]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.87, 0.025, 0.08]} />
        <meshStandardMaterial {...GOLD_TRIM} />
      </mesh>

      {/* Degassing valve (one-way valve circle on front) */}
      <group position={[0.22, 0.28, 0.162]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.012, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial {...VALVE} />
        </mesh>
        <mesh position={[0, 0, 0.01]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.008, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#c5a059" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Bottom gusset */}
      <mesh position={[0, -0.68, 0]} castShadow>
        <boxGeometry args={[0.82, 0.08, 0.38]} />
        <meshStandardMaterial {...FOIL} />
      </mesh>

      {/* Side seams */}
      {[-0.44, 0.44].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.018, 1.25, 0.34]} />
          <meshStandardMaterial {...FOIL} />
        </mesh>
      ))}
    </group>
  )
}
