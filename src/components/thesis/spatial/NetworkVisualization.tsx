
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface NetworkNode {
  position: [number, number, number];
  connections: number[];
}

const generateNetworkNodes = (count: number): NetworkNode[] => {
  const nodes: NetworkNode[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      position: [
        Math.random() * 4 - 2,
        Math.random() * 4 - 2,
        Math.random() * 4 - 2,
      ],
      connections: Array.from({ length: Math.floor(Math.random() * 3) }, () =>
        Math.floor(Math.random() * count)
      ),
    });
  }
  return nodes;
};

export const NetworkVisualization = () => {
  const nodes = generateNetworkNodes(10);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i}>
          <Sphere position={node.position} args={[0.05, 16, 16]}>
            <meshPhysicalMaterial
              color="#ffffff"
              emissive="#6366f1"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </Sphere>
          {node.connections.map((connectionIndex) => (
            <Line
              key={`${i}-${connectionIndex}`}
              points={[node.position, nodes[connectionIndex].position]}
              color="#6366f1"
              lineWidth={0.5}
              transparent
              opacity={0.3}
            />
          ))}
        </group>
      ))}
    </group>
  );
};
