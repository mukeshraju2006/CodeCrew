import { Canvas, useFrame } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { useRef } from "react"

/* ========================= */
/* Shared Follow Logic */
/* ========================= */

function useFollow(ref, basePosition) {
  useFrame((state) => {
    const { mouse, clock, camera } = state
    if (!ref.current) return

    // Always face camera
    ref.current.lookAt(camera.position)

    // Slight tilt toward cursor
    ref.current.rotation.y += mouse.x * 0.25
    ref.current.rotation.x += -mouse.y * 0.15

    // Floating motion
    ref.current.position.y =
      basePosition[1] + Math.sin(clock.elapsedTime * 1.5) * 0.3
  })
}

/* ========================= */
/* Fox */
/* ========================= */

function Fox({ position }) {
  const ref = useRef()
  useFollow(ref, position)

  return (
    <group ref={ref} position={position}>
      {/* Head */}
      <mesh>
        <boxGeometry args={[2, 1.6, 1.6]} />
        <meshStandardMaterial color="#ff7f2a" />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.6, 1, 0]}>
        <coneGeometry args={[0.5, 1, 4]} />
        <meshStandardMaterial color="#ff7f2a" />
      </mesh>

      <mesh position={[0.6, 1, 0]}>
        <coneGeometry args={[0.5, 1, 4]} />
        <meshStandardMaterial color="#ff7f2a" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.5, 0.2, 1.2]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.4} />
      </mesh>

      <mesh position={[0.5, 0.2, 1.2]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

/* ========================= */
/* Panda */
/* ========================= */

function Panda({ position }) {
  const ref = useRef()
  useFollow(ref, position)

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <mesh position={[-0.8, 1, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      <mesh position={[0.8, 1, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      <mesh position={[-0.4, 0.3, 1.3]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="black" emissive="black" emissiveIntensity={0.3} />
      </mesh>

      <mesh position={[0.4, 0.3, 1.3]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="black" emissive="black" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

/* ========================= */
/* Cat */
/* ========================= */

function Cat({ position }) {
  const ref = useRef()
  useFollow(ref, position)

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>

      <mesh position={[-0.7, 1, 0]}>
        <coneGeometry args={[0.4, 0.8, 4]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>

      <mesh position={[0.7, 1, 0]}>
        <coneGeometry args={[0.4, 0.8, 4]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>

      <mesh position={[-0.4, 0.3, 1.2]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.4} />
      </mesh>

      <mesh position={[0.4, 0.3, 1.2]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

/* ========================= */
/* Bird */
/* ========================= */

function Bird({ position }) {
  const ref = useRef()
  useFollow(ref, position)

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#4ea8de" />
      </mesh>

      <mesh position={[0, 0.3, 1.3]}>
        <coneGeometry args={[0.2, 0.6, 4]} />
        <meshStandardMaterial color="#ffae00" />
      </mesh>

      <mesh position={[-0.4, 0.4, 1.3]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.4} />
      </mesh>

      <mesh position={[0.4, 0.4, 1.3]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

/* ========================= */
/* Scene */
/* ========================= */

export default function SpaceScene() {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto"
      }}
      camera={{ position: [0, 0, 12], fov: 60 }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={2} />

      <Stars
        radius={200}
        depth={100}
        count={5000}
        factor={5}
        fade
        speed={0.8}
      />

      <Fox position={[-6, 2, -4]} />
      <Panda position={[-1, -1, -3]} />
      <Cat position={[4, 2, -4]} />
      <Bird position={[8, -1, -5]} />
    </Canvas>
  )
}