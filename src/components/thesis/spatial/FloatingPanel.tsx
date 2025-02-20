
import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

interface FloatingPanelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isActive?: boolean;
}

export const FloatingPanel = ({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isActive = false
}: FloatingPanelProps) => {
  const mesh = useRef<Mesh>(null!);

  useFrame((state) => {
    if (isActive) {
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.02;
      mesh.current.rotation.y = Math.cos(state.clock.getElapsedTime()) * 0.02;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <mesh
        ref={mesh}
        position={position}
        rotation={rotation}
        scale={[scale * 2, scale * 1, scale * 0.1]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          metalness={0.2}
          roughness={0.1}
          envMapIntensity={1}
          transmission={0.9}
        />
      </mesh>
    </Float>
  );
};
