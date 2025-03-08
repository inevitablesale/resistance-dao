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
  revealValue?: number; // Controls the transition between radiation cloud and character model (0-100)
  showControls?: boolean; // Whether to show fullscreen controls
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
  radiationCloudUrl = "bafybeiayvmbutisgus45sujbr65sqnpeqcd3vtu6tjxwbmwadf35frszp4",
  revealValue = 20, // Default to 20 (mostly obscured)
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characterModel, setCharacterModel] = useState<THREE.Group | null>(null);
  const [radiationModel, setRadiationModel] = useState<THREE.Group | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [clock] = useState(new THREE.Clock());
  const [processedCloudUrl, setProcessedCloudUrl] = useState<string | null>(null);
  const [processedModelUrl, setProcessedModelUrl] = useState<string | null>(null);
  
  // Process the IPFS URLs
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        // Process radiation cloud URL
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
        
        // Process character model URL
        if (modelUrl) {
          // Check if modelUrl is already a full URL or just a hash
          if (modelUrl.startsWith('http')) {
            setProcessedModelUrl(modelUrl);
          } else {
            // Remove ipfs:// prefix if it exists
            const modelHash = modelUrl.replace('ipfs://', '');
            const url = await getModelFromIPFS(modelHash);
            setProcessedModelUrl(url);
          }
        }
      } catch (error) {
        console.error('Error processing IPFS URLs:', error);
        setError('Failed to process model URLs');
      }
    };
    
    fetchUrls();
  }, [radiationCloudUrl, modelUrl]);
  
  // Setup the scene, camera, and renderer when URLs are processed
  useEffect(() => {
    if (!containerRef.current || !processedCloudUrl || !processedModelUrl) return;
    
    setLoading(true);
    setError(null);
    
    // Scene setup
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x111111); // Lighter background (dark gray instead of black)
    setScene(newScene);
    
    // Add ambient light - increase intensity
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.6); // Increased from 0.4
    newScene.add(ambientLight);
    
    // Add directional light - increase intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased from 0.8
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);
    
    // Add neutral point lights with increased intensity
    const pointLight1 = new THREE.PointLight(0xffffff, 0.8); // Increased from 0.5
    pointLight1.position.set(2, 1, 3);
    newScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.5); // Increased from 0.3
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
    renderer.toneMappingExposure = 1.5; // Increased from 1.25 for more brightness
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
    
    // Loader for both models
    const loader = new GLTFLoader();
    let loadedCount = 0;
    
    // Load radiation cloud model
    console.log('Loading radiation cloud from:', processedCloudUrl);
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
        
        // Apply transparent material for the radiation cloud
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Calculate opacity based on revealValue (100 - revealValue because 100 means fully revealed)
            const opacity = Math.max(0, Math.min(100, 100 - revealValue)) / 100;
            
            // Apply neutral transparent material
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.transparent = true;
                mat.opacity = opacity;
                
                // Use a slightly toxic green tint for radiation cloud
                mat.color = new THREE.Color(0xaaff88);
                mat.emissive = new THREE.Color(0x113311);
                mat.emissiveIntensity = 0.2;
              });
            } else {
              child.material.transparent = true;
              child.material.opacity = opacity;
              
              // Use a slightly toxic green tint for radiation cloud
              child.material.color = new THREE.Color(0xaaff88);
              child.material.emissive = new THREE.Color(0x113311);
              child.material.emissiveIntensity = 0.2;
            }
          }
        });
        
        // Store the radiation model reference
        setRadiationModel(gltf.scene);
        
        // Add to scene
        newScene.add(gltf.scene);
        
        // Increment loaded count
        loadedCount++;
        if (loadedCount === 2) {
          setLoading(false);
        }
      },
      (xhr) => {
        // Progress callback for radiation cloud
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded - Radiation cloud`);
      },
      (error) => {
        console.error('Error loading radiation cloud model:', error);
        setError('Failed to load radiation cloud. Please check the URL and try again.');
        setLoading(false);
      }
    );
    
    // Load character model
    console.log('Loading character model from:', processedModelUrl);
    loader.load(
      processedModelUrl,
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
        
        // Apply material to character model with opacity based on reveal value
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Calculate opacity based on revealValue (more reveal = more visible character)
            const opacity = Math.max(0, Math.min(100, revealValue)) / 100;
            
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.transparent = true;
                mat.opacity = opacity;
                
                // Keep original colors but adjust emissive for a slight glow
                mat.emissiveIntensity = 0.1;
              });
            } else {
              child.material.transparent = true;
              child.material.opacity = opacity;
              
              // Keep original colors but adjust emissive for a slight glow
              child.material.emissiveIntensity = 0.1;
            }
          }
        });
        
        // Store the character model reference
        setCharacterModel(gltf.scene);
        
        // Add to scene
        newScene.add(gltf.scene);
        
        // Increment loaded count
        loadedCount++;
        if (loadedCount === 2) {
          setLoading(false);
        }
      },
      (xhr) => {
        // Progress callback for character model
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded - Character model`);
      },
      (error) => {
        console.error('Error loading character model:', error);
        setError('Failed to load character model. Please check the URL and try again.');
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
      
      // Update models' opacity based on reveal value whenever it changes
      if (radiationModel) {
        radiationModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const opacity = Math.max(0, Math.min(100, 100 - revealValue)) / 100;
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.opacity = opacity;
              });
            } else {
              child.material.opacity = opacity;
            }
          }
        });
      }
      
      if (characterModel) {
        characterModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const opacity = Math.max(0, Math.min(100, revealValue)) / 100;
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.opacity = opacity;
              });
            } else {
              child.material.opacity = opacity;
            }
          }
        });
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
  }, [processedCloudUrl, processedModelUrl, autoRotate, revealValue]); // Added revealValue to the dependency array
  
  // Directly render the container for the 3D model
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
