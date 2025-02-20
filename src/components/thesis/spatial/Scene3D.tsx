
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, useAspect } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { ReactNode } from "react";

interface Scene3DProps {
  children: ReactNode;
}

export const Scene3D = ({ children }: Scene3DProps) => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
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
