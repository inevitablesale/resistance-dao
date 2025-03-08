
import React, { useRef, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RadiationOverlay } from '@/components/radiation/RadiationOverlay';

interface ModelPreviewProps {
  modelUrl: string;
  className?: string;
  height?: string;
  width?: string;
  autoRotate?: boolean;
  radiationLevel?: number; // Added radiation level prop
  animateRadiation?: boolean; // Whether to animate radiation dissipation
}

export const ModelPreview: React.FC<ModelPreviewProps> = ({ 
  modelUrl, 
  className = "", 
  height = "200px", 
  width = "100%",
  autoRotate = true,
  radiationLevel = 0, // Default to no radiation
  animateRadiation = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    setLoading(true);
    setError(null);
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x39ff14, 0.5); // Toxic green
    pointLight1.position.set(2, 1, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff3333, 0.3); // Reddish for contrast
    pointLight2.position.set(-2, 2, -1);
    scene.add(pointLight2);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      40, // FOV
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    containerRef.current.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.5;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    
    // Load the model
    const loader = new GLTFLoader();
    
    // Process modelUrl - if it starts with 'ipfs://' convert to HTTPS gateway URL
    const processedUrl = modelUrl.startsWith('ipfs://') 
      ? `https://gateway.pinata.cloud/ipfs/${modelUrl.replace('ipfs://', '')}`
      : modelUrl;
    
    loader.load(
      processedUrl,
      (gltf) => {
        // Center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Normalize and center
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        
        // Add model to scene
        scene.add(gltf.scene);
        setLoading(false);
        setModelLoaded(true);
      },
      (xhr) => {
        // Progress callback
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load 3D model');
        setLoading(false);
      }
    );
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          }
        }
      });
      
      renderer.dispose();
      controls.dispose();
    };
  }, [modelUrl, autoRotate]);
  
  return (
    <RadiationOverlay 
      radiationLevel={radiationLevel}
      animate={animateRadiation && modelLoaded}
      className={`${className}`}
    >
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-lg overflow-hidden" 
        style={{ height, width }}
      >
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 text-toxic-neon animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-apocalypse-red text-center p-4">
              <p>{error}</p>
              <p className="text-xs mt-2">Try a different model or check the URL</p>
            </div>
          </div>
        )}
      </div>
    </RadiationOverlay>
  );
};
