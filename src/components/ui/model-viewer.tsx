import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  useGLTF, 
  OrbitControls, 
  Environment, 
  Stage, 
  PerspectiveCamera,
  useProgress,
  Html
} from '@react-three/drei';
import { Suspense } from 'react';
import { Group, MeshStandardMaterial, Color } from 'three';
import { ToxicButton } from './toxic-button';
import { Loader2 } from 'lucide-react';

const ModelLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-toxic-neon mb-2" />
        <div className="text-toxic-neon text-sm font-mono">
          Loading Model... {Math.round(progress)}%
        </div>
      </div>
    </Html>
  );
};

const Model = ({ 
  url, 
  autoRotate = true, 
  radiationEffect = false,
  rotationSpeed = 0.005
}: { 
  url: string;
  autoRotate?: boolean;
  radiationEffect?: boolean;
  rotationSpeed?: number;
}) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (radiationEffect) {
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const originalEmissive = child.material.emissive 
            ? child.material.emissive.clone() 
            : new Color(0x000000);
          const originalEmissiveIntensity = child.material.emissiveIntensity || 0;
          
          const newMaterial = new MeshStandardMaterial({
            ...child.material,
            emissive: new Color(0x00ff66),
            emissiveIntensity: 0.3,
          });
          
          child.material = newMaterial;
          
          child.userData.originalEmissive = originalEmissive;
          child.userData.originalEmissiveIntensity = originalEmissiveIntensity;
        }
      });
    }
    
    return () => {
      scene.traverse((child: any) => {
        if (child.isMesh && child.material && child.userData.originalEmissive) {
          child.material.emissive = child.userData.originalEmissive;
          child.material.emissiveIntensity = child.userData.originalEmissiveIntensity;
        }
      });
    };
  }, [scene, radiationEffect]);

  useEffect(() => {
    if (radiationEffect) {
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (hovered) {
            child.material.emissiveIntensity = 0.6;
          } else {
            child.material.emissiveIntensity = 0.3;
          }
        }
      });
    }
  }, [hovered, scene, radiationEffect]);

  useFrame(() => {
    if (group.current && autoRotate) {
      group.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group 
      ref={group} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive 
        object={scene} 
        scale={1} 
        position={[0, 0, 0]} 
      />
    </group>
  );
};

const CameraController = ({ initialZoom = 2 }: { initialZoom?: number }) => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, initialZoom);
    camera.lookAt(0, 0, 0);
  }, [camera, initialZoom]);
  
  return null;
};

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export interface ModelViewerProps {
  ipfsHash: string;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  autoRotate?: boolean;
  radiationEffect?: boolean;
  rotationSpeed?: number;
  showControls?: boolean;
  initialZoom?: number;
  onError?: (error: Error) => void;
  className?: string;
}

export const ModelViewer = ({
  ipfsHash,
  width = "100%",
  height = "300px",
  backgroundColor = "transparent",
  autoRotate = true,
  radiationEffect = false,
  rotationSpeed = 0.005,
  showControls = true,
  initialZoom = 2,
  onError,
  className = "",
}: ModelViewerProps) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  
  const handleRetry = () => {
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };
  
  const ErrorFallback = () => (
    <div className="flex flex-col items-center justify-center h-full w-full bg-black/40 p-4 rounded-md border border-toxic-neon/30">
      <div className="text-toxic-neon font-mono mb-4 text-center">
        <span className="block text-apocalypse-red mb-2">ERROR LOADING MODEL</span>
        <span className="block text-white/70 text-sm mb-4">The 3D model could not be loaded from IPFS</span>
      </div>
      <ToxicButton onClick={handleRetry} variant="outline">
        Retry Connection
      </ToxicButton>
    </div>
  );
  
  return (
    <div 
      className={`relative model-viewer-container ${className}`} 
      style={{ width, height, backgroundColor }}
    >
      {hasError ? (
        <ErrorFallback />
      ) : (
        <ModelErrorBoundary fallback={<ErrorFallback />}>
          <Canvas key={`model-canvas-${retryCount}`} shadows dpr={[1, 2]}>
            <Suspense fallback={<ModelLoader />}>
              <CameraController initialZoom={initialZoom} />
              <Model 
                url={pinataUrl} 
                autoRotate={autoRotate} 
                radiationEffect={radiationEffect}
                rotationSpeed={rotationSpeed}
              />
              <Environment preset="city" />
              {showControls && <OrbitControls enableZoom={true} enablePan={false} />}
            </Suspense>
          </Canvas>
        </ModelErrorBoundary>
      )}
      
      {radiationEffect && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-toxic-neon/5 mix-blend-overlay radiation-pulse"></div>
          <div className="absolute inset-0 scanline opacity-20"></div>
        </div>
      )}
    </div>
  );
};

useGLTF.preload('https://gateway.pinata.cloud/ipfs/bafybeic2yffnslotf33yojsihiyv73rmxenstfwcxnyws5ktxp2mptkb3q');
useGLTF.preload('https://gateway.pinata.cloud/ipfs/bafybeifzvpyj5znhgjq22cbjyzav5zsvese3m3klbkc4lcdm3fdbbxiooa');
