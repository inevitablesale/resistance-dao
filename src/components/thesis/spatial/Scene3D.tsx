
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ReactNode } from "react";
import * as THREE from "three";

interface Scene3DProps {
  children: ReactNode;
}

export const Scene3D = ({ children }: Scene3DProps) => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true }}
        shadows
        legacy
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputEncoding = THREE.sRGBEncoding;
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.5}
        />
        {children}
      </Canvas>
    </div>
  );
};
