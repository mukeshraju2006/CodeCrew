import { Canvas, useFrame } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { useRef } from "react"

/* ============================= */
/* Shared Follow Logic */
/* ============================= */

function useFollow(ref, basePosition) {
  useFrame((state) => {
    const { mouse, clock, camera } = state
    if (!ref.current) return

    // Always face camera
    ref.current.lookAt(camera.position)

    // Subtle tilt toward cursor
    ref.current.rotation.y += mouse.x * 0.25
    ref.current.rotation.x += -mouse.y * 0.15

    // Floating
    ref.current.position.y =
      basePosition[1] + Math.sin(clock.elapsedTime * 1.5) * 0.3
  })
}

/* ============================= */
/* Premium Fox */
/* ============================= */

function Fox({ position }) {
  const ref = useRef()

  useFrame((state) => {
    const { mouse, clock, camera } = state
    if (!ref.current) return

    ref.current.lookAt(camera.position)

    ref.current.rotation.y += mouse.x * 0.25
    ref.current.rotation.x += -mouse.y * 0.15

    ref.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 1.5) * 0.2

    // subtle breathing
    const breathe = 1 + Math.sin(clock.elapsedTime * 2) * 0.02
    ref.current.scale.set(breathe * 1.6, breathe * 1.6, breathe * 1.6)
  })

  return (
    <group ref={ref} position={position}>

      {/* Main Head */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#ff5c00"
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>

      {/* Lower Face */}
      <mesh position={[0, -0.25, 0.7]}>
        <sphereGeometry args={[0.7, 64, 64]} />
        <meshStandardMaterial
          color="#fff3e6"
          roughness={0.6}
        />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.65, 0.9, -0.1]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.35, 1.2, 32]} />
        <meshStandardMaterial color="#ff5c00" />
      </mesh>

      <mesh position={[0.65, 0.9, -0.1]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.35, 1.2, 32]} />
        <meshStandardMaterial color="#ff5c00" />
      </mesh>

      {/* Inner Ears */}
      <mesh position={[-0.65, 0.9, 0.2]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.2, 0.8, 32]} />
        <meshStandardMaterial
          color="#ffb199"
          emissive="#ff884d"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[0.65, 0.9, 0.2]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.2, 0.8, 32]} />
        <meshStandardMaterial
          color="#ffb199"
          emissive="#ff884d"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.35, 0.15, 1]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={0.7}
        />
      </mesh>

      <mesh position={[0.35, 0.15, 1]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.35, 0.15, 1.15]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      <mesh position={[0.35, 0.15, 1.15]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.2, 1.3]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

    </group>
  )
}
/* ============================= */
/* Premium Panda */
/* ============================= */

function Panda({ position }) {
  const ref = useRef()

  useFrame((state) => {
    const { mouse, clock, camera } = state
    if (!ref.current) return

    ref.current.lookAt(camera.position)

    ref.current.rotation.y += mouse.x * 0.15
    ref.current.rotation.x += -mouse.y * 0.08

    ref.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 1.2) * 0.08

    const breathe = 1 + Math.sin(clock.elapsedTime * 2) * 0.008
    ref.current.scale.set(breathe * 1.4, breathe * 1.4, breathe * 1.4)
  })

  return (
    <group ref={ref} position={position}>

      {/* Head (smaller now) */}
      <mesh>
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* Ears (kept same but slightly refined placement) */}
      <mesh position={[-0.8, 1, -0.1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      <mesh position={[0.8, 1, -0.1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Soft Eye Patches */}
      <mesh position={[-0.45, 0.25, 0.8]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      <mesh position={[0.45, 0.25, 0.8]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.45, 0.25, 1]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0.45, 0.25, 1]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Pupils (centered but slightly lower) */}
      <mesh position={[-0.45, 0.18, 1.15]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      <mesh position={[0.45, 0.18, 1.15]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Eye Highlights */}
      <mesh position={[-0.38, 0.32, 1.22]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0.52, 0.32, 1.22]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Nose */}
    <mesh position={[0, -0.05, 1.2]}>
    <sphereGeometry args={[0.07, 16, 16]} />
    <meshStandardMaterial color="#555" />
    </mesh>

    {/* Soft Tiny Smile */}
    <mesh position={[0, -0.25, 1.15]}>
    <torusGeometry args={[0.14, 0.03, 16, 60, Math.PI]} />
    <meshStandardMaterial color="#444" />
    </mesh>

    </group>
  )
}
/* ============================= */
/* Scene */
/* ============================= */

export default function LoginAnimals() {
  return (
    <Canvas
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto"
      }}
      camera={{ position: [0, 0, 12], fov: 60 }}
    >
      <ambientLight intensity={1.3} />
      <directionalLight position={[10, 10, 5]} intensity={2.2} />

      <Stars radius={200} depth={100} count={3000} factor={4} fade speed={0.6} />

      <Fox position={[-9, 1.5, -5]} />
      <Panda position={[9, -1.5, -5]} />
    </Canvas>
  )
}