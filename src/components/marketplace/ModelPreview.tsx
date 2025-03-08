
import React, { useRef, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RadiationOverlay } from '@/components/radiation/RadiationOverlay';
import { getModelFromIPFS } from '@/services/ipfsService';

interface ModelPreviewProps {
  modelUrl: string;
  className?: string;
  height?: string;
  width?: string;
  autoRotate?: boolean;
  radiationLevel?: number;
  animateRadiation?: boolean;
  useRadiationCloud?: boolean;
  radiationCloudUrl?: string;
}

export const ModelPreview: React.FC<ModelPreviewProps> = ({ 
  modelUrl, 
  className = "", 
  height = "200px", 
  width = "100%",
  autoRotate = true,
  radiationLevel = 0,
  animateRadiation = true,
  useRadiationCloud = false,
  radiationCloudUrl = "bafybeiayvmbutisgus45sujbr65sqnpeqcd3vtu6tjxwbmwadf35frszp4"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [radiationModel, setRadiationModel] = useState<THREE.Group | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [clock] = useState(new THREE.Clock());
  const [processedCloudUrl, setProcessedCloudUrl] = useState<string | null>(null);
  
  // Process the radiation cloud URL using the IPFS service
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        if (radiationCloudUrl) {
          // Check if radiationCloudUrl is already a full URL or just a hash
          if (radiationCloudUrl.startsWith('http')) {
            setProcessedCloudUrl(radiationCloudUrl);
          } else {
            // Remove ipfs:// prefix if it exists
            const cloudHash = radiationCloudUrl.replace('ipfs://', '');
            const url = await getModelFromIPFS(cloudHash);
            setProcessedCloudUrl(url);
          }
        }
      } catch (error) {
        console.error('Error processing IPFS URLs:', error);
        setError('Failed to process model URLs');
      }
    };
    
    fetchUrls();
  }, [radiationCloudUrl]);
  
  // Setup the scene, camera, and renderer
  useEffect(() => {
    if (!containerRef.current || !processedCloudUrl) return;
    
    setLoading(true);
    setError(null);
    
    // Scene setup
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x000000);
    setScene(newScene);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    newScene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);
    
    // Add neutral point lights instead of colored ones
    const pointLight1 = new THREE.PointLight(0xffffff, 0.5); // Changed to white
    pointLight1.position.set(2, 1, 3);
    newScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.3); // Changed to white
    pointLight2.position.set(-2, 2, -1);
    newScene.add(pointLight2);
    
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
    
    // Animation mixer
    const newMixer = new THREE.AnimationMixer(newScene);
    setMixer(newMixer);
    
    console.log('Loading radiation cloud from:', processedCloudUrl);
    
    // Load radiation cloud model
    const loader = new GLTFLoader();
    loader.load(
      processedCloudUrl,
      (gltf) => {
        // Center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Normalize and center
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.8 / maxDim; // Set appropriate scale
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        
        // Apply transparent material with neutral color
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Apply neutral transparent material without color tint
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.transparent = true;
                mat.opacity = radiationLevel / 100;
                
                // Use neutral gray color instead of green/yellow
                mat.color = new THREE.Color(0xffffff);
                mat.emissive = new THREE.Color(0x000000);
                mat.emissiveIntensity = 0;
              });
            } else {
              child.material.transparent = true;
              child.material.opacity = radiationLevel / 100;
              
              // Use neutral gray color instead of green/yellow
              child.material.color = new THREE.Color(0xffffff);
              child.material.emissive = new THREE.Color(0x000000);
              child.material.emissiveIntensity = 0;
            }
          }
        });
        
        // Store the radiation model reference
        setRadiationModel(gltf.scene);
        
        // Add to scene
        newScene.add(gltf.scene);
        setLoading(false);
        setModelLoaded(true);
      },
      (xhr) => {
        // Progress callback
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded - Radiation cloud`);
      },
      (error) => {
        console.error('Error loading radiation cloud model:', error);
        setError('Failed to load radiation cloud. Please check the URL and try again.');
        setLoading(false);
      }
    );
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Update mixer for animations
      if (newMixer) {
        const delta = clock.getDelta();
        newMixer.update(delta);
      }
      
      controls.update();
      renderer.render(newScene, camera);
      
      return animationId;
    };
    
    const animationId = animate();
    
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
      cancelAnimationFrame(animationId);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      if (newScene) {
        newScene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            } else if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            }
          }
        });
      }
      
      renderer.dispose();
      controls.dispose();
      if (newMixer) newMixer.stopAllAction();
    };
  }, [processedCloudUrl, autoRotate, radiationLevel]);
  
  // Instead of using the RadiationOverlay with effects, we'll directly render the container for the 3D model
  return (
    <div className={`${className}`}>
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-lg overflow-hidden" 
        style={{ height, width }}
      >
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-red-500 text-center p-4">
              <p>{error}</p>
              <p className="text-xs mt-2">Try a different model or check the URL</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
