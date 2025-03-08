
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

// Loading component displayed while the GLB model is loading
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

// The actual 3D model with auto-rotation and glow effect
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
  
  // Apply glowing effect to all materials if radiation effect is enabled
  useEffect(() => {
    if (radiationEffect) {
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          // Store original material properties
          const originalEmissive = child.material.emissive 
            ? child.material.emissive.clone() 
            : new Color(0x000000);
          const originalEmissiveIntensity = child.material.emissiveIntensity || 0;
          
          // Create a new material with glow effect
          const newMaterial = new MeshStandardMaterial({
            ...child.material,
            emissive: new Color(0x00ff66), // Toxic green glow
            emissiveIntensity: 0.3,
          });
          
          // Apply the new material
          child.material = newMaterial;
          
          // Store original values for hover states
          child.userData.originalEmissive = originalEmissive;
          child.userData.originalEmissiveIntensity = originalEmissiveIntensity;
        }
      });
    }
    
    return () => {
      // Cleanup function
      scene.traverse((child: any) => {
        if (child.isMesh && child.material && child.userData.originalEmissive) {
          child.material.emissive = child.userData.originalEmissive;
          child.material.emissiveIntensity = child.userData.originalEmissiveIntensity;
        }
      });
    };
  }, [scene, radiationEffect]);

  // Handle hover effects
  useEffect(() => {
    if (radiationEffect) {
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (hovered) {
            child.material.emissiveIntensity = 0.6; // Increase intensity on hover
          } else {
            child.material.emissiveIntensity = 0.3; // Reset to normal when not hovering
          }
        }
      });
    }
  }, [hovered, scene, radiationEffect]);

  // Auto-rotation animation
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

// The camera controls component
const CameraController = ({ initialZoom = 2 }: { initialZoom?: number }) => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, initialZoom);
    camera.lookAt(0, 0, 0);
  }, [camera, initialZoom]);
  
  return null;
};

// Error boundary for handling loading failures
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

// Main component for the model viewer
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
  initialZoom = 2, // Changed default from 5 to 2
  onError,
  className = "",
}: ModelViewerProps) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Construct the Pinata gateway URL
  const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  
  // Handler for retry button
  const handleRetry = () => {
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };
  
  // Error fallback UI
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
      
      {/* Overlay radiation effect */}
      {radiationEffect && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-toxic-neon/5 mix-blend-overlay radiation-pulse"></div>
          <div className="absolute inset-0 scanline opacity-20"></div>
        </div>
      )}
    </div>
  );
};

// Preload the model to avoid jank when it's first displayed
useGLTF.preload('https://gateway.pinata.cloud/ipfs/bafybeic2yffnslotf33yojsihiyv73rmxenstfwcxnyws5ktxp2mptkb3q');
