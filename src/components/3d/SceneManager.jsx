import { Suspense } from 'react'
import { Environment } from '@react-three/drei'
import useStore from '../../store/useStore'
import SceneLighting from './SceneLighting'
import TamperModel from './models/TamperModel'
import CezveModel from './models/CezveModel'
import BottleModel from './models/BottleModel'
import BagModel from './models/BagModel'

// Maps product.model field → component
const MODEL_MAP = {
  tamper: TamperModel,
  cezve: CezveModel,
  bottle: BottleModel,
  bag: BagModel,
}

function ProductModel({ product, index }) {
  const activeSection = useStore((s) => s.activeSection)
  const isActive = activeSection === index
  const Component = MODEL_MAP[product.model]
  if (!Component) return null
  return <Component active={isActive} product={product} />
}

export default function SceneManager() {
  const products = useStore((s) => s.products)

  return (
    <>
      <SceneLighting />

      {/* IBL — makes metallic/glass materials look realistic */}
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

      {/* Render all models; each manages its own visibility via scale lerp */}
      <Suspense fallback={null}>
        {products.map((product, i) => (
          <ProductModel key={product.id} product={product} index={i} />
        ))}
      </Suspense>
    </>
  )
}
