
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
  radiationCloudUrl = "https://gateway.pinata.cloud/ipfs/bafybeiayvmbutisgus45sujbr65sqnpeqcd3vtu6tjxwbmwadf35frszp4"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [mainModel, setMainModel] = useState<THREE.Group | null>(null);
  const [radiationModel, setRadiationModel] = useState<THREE.Group | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [clock] = useState(new THREE.Clock());
  
  // Process modelUrl - if it starts with 'ipfs://' convert to HTTPS gateway URL
  const processUrl = (url: string) => {
    return url.startsWith('ipfs://') 
      ? `https://gateway.pinata.cloud/ipfs/${url.replace('ipfs://', '')}`
      : url;
  };
  
  // Setup the scene, camera, and renderer
  useEffect(() => {
    if (!containerRef.current) return;
    
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
    
    // Add point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x39ff14, 0.5); // Toxic green
    pointLight1.position.set(2, 1, 3);
    newScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff3333, 0.3); // Reddish for contrast
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
    
    // Load the models - Main model and radiation cloud if needed
    const loader = new GLTFLoader();
    const processedModelUrl = processUrl(modelUrl);
    
    // Animation mixer
    const newMixer = new THREE.AnimationMixer(newScene);
    setMixer(newMixer);
    
    // Load the main model
    loader.load(
      processedModelUrl,
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
        
        // Handle animations if they exist
        if (gltf.animations && gltf.animations.length) {
          gltf.animations.forEach((clip) => {
            newMixer.clipAction(clip, gltf.scene).play();
          });
        }
        
        // Store the model reference
        setMainModel(gltf.scene);
        
        // Add model to scene with opacity based on radiation level
        if (useRadiationCloud) {
          // If using radiation cloud, start with main model fully transparent
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  if (mat.transparent !== undefined) {
                    mat.transparent = true;
                    mat.opacity = 1 - (radiationLevel / 100);
                  }
                });
              } else {
                child.material.transparent = true;
                child.material.opacity = 1 - (radiationLevel / 100);
              }
            }
          });
        }
        
        // Add to scene
        newScene.add(gltf.scene);
        
        // If not using radiation cloud, we're done loading
        if (!useRadiationCloud) {
          setLoading(false);
          setModelLoaded(true);
        }
      },
      (xhr) => {
        // Progress callback
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded - Main model`);
      },
      (error) => {
        console.error('Error loading main model:', error);
        setError('Failed to load 3D model');
        setLoading(false);
      }
    );
    
    // Load radiation cloud model if needed
    if (useRadiationCloud) {
      const processedCloudUrl = processUrl(radiationCloudUrl);
      
      loader.load(
        processedCloudUrl,
        (gltf) => {
          // Center the model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Normalize and center
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.8 / maxDim; // Slightly larger than main model
          gltf.scene.scale.set(scale, scale, scale);
          gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          
          // Create glowing shader material for radiation effect
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // Apply glowing effect to the cloud model
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  mat.transparent = true;
                  mat.opacity = radiationLevel / 100;
                  mat.emissive = new THREE.Color(0x39ff14); // Toxic green glow
                  mat.emissiveIntensity = 0.5;
                });
              } else {
                child.material.transparent = true;
                child.material.opacity = radiationLevel / 100;
                child.material.emissive = new THREE.Color(0x39ff14);
                child.material.emissiveIntensity = 0.5;
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
          // Continue with main model even if radiation cloud fails
          setLoading(false);
          setModelLoaded(true);
        }
      );
    }
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Update mixer for animations
      if (newMixer) {
        const delta = clock.getDelta();
        newMixer.update(delta);
      }
      
      // Update material opacity based on radiation level if models exist
      if (useRadiationCloud && mainModel && radiationModel) {
        // Main model gets more visible as radiation decreases
        mainModel.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if (mat.opacity !== undefined) {
                  mat.opacity = 1 - (radiationLevel / 100);
                }
              });
            } else if (child.material.opacity !== undefined) {
              child.material.opacity = 1 - (radiationLevel / 100);
            }
          }
        });
        
        // Radiation cloud gets less visible as radiation decreases
        radiationModel.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if (mat.opacity !== undefined) {
                  mat.opacity = radiationLevel / 100;
                }
              });
            } else if (child.material.opacity !== undefined) {
              child.material.opacity = radiationLevel / 100;
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
      
      if (containerRef.current) {
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
  }, [modelUrl, autoRotate, radiationCloudUrl, useRadiationCloud]);
  
  // Update opacity when radiation level changes
  useEffect(() => {
    if (scene && mainModel && radiationModel && useRadiationCloud) {
      // Update main model opacity
      mainModel.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat.opacity !== undefined) {
                mat.opacity = 1 - (radiationLevel / 100);
              }
            });
          } else if (child.material.opacity !== undefined) {
            child.material.opacity = 1 - (radiationLevel / 100);
          }
        }
      });
      
      // Update radiation cloud opacity
      radiationModel.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat.opacity !== undefined) {
                mat.opacity = radiationLevel / 100;
              }
            });
          } else if (child.material.opacity !== undefined) {
            child.material.opacity = radiationLevel / 100;
          }
        }
      });
    }
  }, [radiationLevel, scene, mainModel, radiationModel, useRadiationCloud]);
  
  return (
    <RadiationOverlay 
      radiationLevel={useRadiationCloud ? 0 : radiationLevel} // No gradient overlay if using 3D cloud
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
