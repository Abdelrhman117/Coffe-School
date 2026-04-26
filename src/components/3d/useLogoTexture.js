import { useMemo } from 'react'
import * as THREE from 'three'

export default function useLogoTexture() {
  return useMemo(() => {
    const W = 512, H = 256
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, W, H)

    // Outer ellipse border
    ctx.strokeStyle = 'rgba(197,160,89,0.55)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(W / 2, H / 2, W / 2 - 8, H / 2 - 8, 0, 0, Math.PI * 2)
    ctx.stroke()

    // Inner ellipse
    ctx.strokeStyle = 'rgba(197,160,89,0.25)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(W / 2, H / 2, W / 2 - 18, H / 2 - 18, 0, 0, Math.PI * 2)
    ctx.stroke()

    // Top divider line
    ctx.strokeStyle = 'rgba(197,160,89,0.5)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(W / 2 - 90, 68)
    ctx.lineTo(W / 2 + 90, 68)
    ctx.stroke()

    // "Coffee School" — main English text
    ctx.fillStyle = '#c5a059'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'bold 62px Arial, sans-serif'
    ctx.fillText('Coffee School', W / 2, H / 2 - 16)

    // Bottom divider line
    ctx.beginPath()
    ctx.moveTo(W / 2 - 90, H / 2 + 22)
    ctx.lineTo(W / 2 + 90, H / 2 + 22)
    ctx.stroke()

    // Arabic subtitle
    ctx.font = '34px Arial, sans-serif'
    ctx.fillStyle = 'rgba(197,160,89,0.8)'
    ctx.fillText('مدرسة القهوة', W / 2, H / 2 + 50)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    return texture
  }, [])
}
