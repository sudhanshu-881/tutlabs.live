import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'

function FloatingTorus() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <torusKnotGeometry args={[1.2, 0.35, 128, 16]} />
        <meshStandardMaterial color="#6366f1" metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  )
}

export const Hero3D: React.FC = () => {
  return (
    <div className="h-[320px] w-full rounded-xl border bg-gradient-to-b from-transparent to-[hsl(var(--accent))]">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 4, 4]} intensity={0.8} />
        <Suspense fallback={null}>
          <FloatingTorus />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  )
}
