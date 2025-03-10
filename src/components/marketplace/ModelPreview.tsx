
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
  
  // Create a buffer to smooth the transition
  const smoothedRevealValue = useRef(revealValue);
  const lastRevealValue = useRef(revealValue);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  
  // Process the IPFS URLs
  useEffect(() => {
    const processUrls = () => {
      try {
        // Process radiation cloud URL
        if (radiationCloudUrl) {
          // Check if radiationCloudUrl is already a full URL or just a hash
          if (radiationCloudUrl.startsWith('http')) {
            setProcessedCloudUrl(radiationCloudUrl);
          } else if (radiationCloudUrl.startsWith('ipfs://')) {
            // Format as Pinata gateway URL
            const cloudUrl = `https://blue-shaggy-halibut-668.mypinata.cloud/ipfs/${radiationCloudUrl.replace('ipfs://', '')}`;
            console.log('Radiation cloud URL from ipfs://', cloudUrl);
            setProcessedCloudUrl(cloudUrl);
          } else {
            // Assume it's just the hash
            const cloudUrl = `https://blue-shaggy-halibut-668.mypinata.cloud/ipfs/${radiationCloudUrl}`;
            console.log('Radiation cloud URL from hash:', cloudUrl);
            setProcessedCloudUrl(cloudUrl);
          }
        }
        
        // Process character model URL
        console.log('Processing character model URL:', modelUrl);
        
        if (modelUrl) {
          // Check if modelUrl is already a full URL or just a hash
          if (modelUrl.startsWith('http')) {
            setProcessedModelUrl(modelUrl);
            console.log('Using direct model URL:', modelUrl);
          } else if (modelUrl.startsWith('ipfs://')) {
            // Format as Pinata gateway URL
            const url = `https://blue-shaggy-halibut-668.mypinata.cloud/ipfs/${modelUrl.replace('ipfs://', '')}`;
            console.log('Character model URL from ipfs://', url);
            setProcessedModelUrl(url);
          } else {
            // Assume it's just the hash
            const url = `https://blue-shaggy-halibut-668.mypinata.cloud/ipfs/${modelUrl}`;
            console.log('Character model URL from hash:', url);
            setProcessedModelUrl(url);
          }
        } else {
          console.warn('No model URL provided');
        }
      } catch (error) {
        console.error('Error processing IPFS URLs:', error);
        setError('Failed to process model URLs');
      }
    };
    
    processUrls();
  }, [radiationCloudUrl, modelUrl]);
  
  // Update on reveal value change
  useEffect(() => {
    // Save the last reveal value for comparison
    lastRevealValue.current = revealValue;
    
    // Update models based on new reveal value
    updateModelsVisibility(revealValue);
    
  }, [revealValue]);
  
  // Setup the scene, camera, and renderer when URLs are processed
  useEffect(() => {
    if (!containerRef.current || !processedCloudUrl || !processedModelUrl) return;
    
    setLoading(true);
    setError(null);
    
    // Scene setup
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x111111); // Dark gray background
    setScene(newScene);
    
    // Add ambient light with increased intensity
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.8); // Increased ambient light
    newScene.add(ambientLight);
    
    // Add directional light with increased intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased directional light
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);
    
    // Add point lights for better 3D definition - positioned to light from all sides
    const pointLight1 = new THREE.PointLight(0xffffff, 0.8);
    pointLight1.position.set(2, 1, 3);
    newScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.8);
    pointLight2.position.set(-2, 2, -1);
    newScene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xffffff, 0.6);
    pointLight3.position.set(0, -2, 1);
    newScene.add(pointLight3);
    
    const pointLight4 = new THREE.PointLight(0xffffff, 0.6);
    pointLight4.position.set(0, 2, -3);
    newScene.add(pointLight4);
    
    // Add a subtle radiation-colored point light
    const radiationLight = new THREE.PointLight(0xaaff88, 0.4);
    radiationLight.position.set(0, 0, 2);
    newScene.add(radiationLight);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      40, // FOV
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Renderer setup with improved settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
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
    controlsRef.current = controls;
    
    // Animation mixer
    const newMixer = new THREE.AnimationMixer(newScene);
    setMixer(newMixer);
    
    // Create particle system for radiation effect
    createParticleSystem(newScene);
    
    // Load models
    loadModels(newScene);
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Update mixer for animations
      if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
      }
      
      // Smoothly update reveal value
      smoothedRevealValue.current = smoothTransition(smoothedRevealValue.current, revealValue);
      
      // Update particle effect
      updateParticleEffect(smoothedRevealValue.current);
      
      // Update controls and render
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && cameraRef.current && scene) {
        rendererRef.current.render(scene, cameraRef.current);
      }
      
      return animationId;
    };
    
    const animationId = animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      if (cameraRef.current) {
        cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
      }
      
      if (rendererRef.current) {
        rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      
      if (containerRef.current && rendererRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      disposeResources();
    };
  }, [processedCloudUrl, processedModelUrl, autoRotate]);
  
  // Helper function to update models visibility based on reveal value
  const updateModelsVisibility = (value: number) => {
    if (!characterModel || !radiationModel) return;
    
    // Calculate opacities - character becomes more visible as value increases
    const characterOpacity = Math.max(0, Math.min(1, value / 100));
    // Radiation becomes less visible as value increases
    const radiationOpacity = Math.max(0, Math.min(1, 1 - (value / 100)));
    
    // Update character model materials
    characterModel.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            mat.transparent = true;
            mat.opacity = characterOpacity;
            mat.needsUpdate = true;
          });
        } else {
          child.material.transparent = true;
          child.material.opacity = characterOpacity;
          child.material.needsUpdate = true;
        }
      }
    });
    
    // Update radiation model materials
    radiationModel.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            mat.transparent = true;
            mat.opacity = radiationOpacity * 0.9; // Slightly transparent even at maximum
            mat.needsUpdate = true;
          });
        } else {
          child.material.transparent = true;
          child.material.opacity = radiationOpacity * 0.9; // Slightly transparent even at maximum
          child.material.needsUpdate = true;
        }
      }
    });
  };
  
  // Helper function for smooth transitions
  const smoothTransition = (current: number, target: number, factor = 0.1) => {
    return current + (target - current) * factor;
  };
  
  // Create particle system for radiation effect
  const createParticleSystem = (scene: THREE.Scene) => {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    // Create particles in a spherical distribution
    for (let i = 0; i < particleCount; i++) {
      // Random spherical coordinates
      const radius = 2.5 * Math.cbrt(Math.random()); // cube root for uniform distribution
      const theta = Math.random() * Math.PI * 2; // horizontal angle
      const phi = Math.acos(2 * Math.random() - 1); // vertical angle
      
      // Convert to Cartesian coordinates
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random size
      particleSizes[i] = Math.random() * 0.03 + 0.01;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    // Create particle material with glow effect
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xaaff88) },
        pointTexture: { value: new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTEyLTAzVDE5OjM4OjU4LTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0xMi0wM1QxOTozOToyOC0wODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0xMi0wM1QxOTozOToyOC0wODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmMzIwOGU0YS01OTVmLTRiNGItYmFkMy1lZWZiMzkxOTIzMDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZjMyMDhlNGEtNTk1Zi00YjRiLWJhZDMtZWVmYjM5MTkyMzAxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZjMyMDhlNGEtNTk1Zi00YjRiLWJhZDMtZWVmYjM5MTkyMzAxIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmMzIwOGU0YS01OTVmLTRiNGItYmFkMy1lZWZiMzkxOTIzMDEiIHN0RXZ0OndoZW49IjIwMTgtMTItMDNUMTk6Mzg6NTgtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ehC/cAAAE/UlEQVRYheWXW4hWVRTHf/vMOXPmXL5Lzpe3yYtWakGJhSRZpBFeUCzpQgVREd0uUhFdCCsq6IYvRRQGBUF0Q7QuUlRUDxZRTmZUD5n2YKEyOY7ztXTmzLl837c+H84Z/U5jYRD0UBu+zdqctdf67/9aa+/9wf/tFl5UPl8BbATmAalJIингKPB97epDL6qMnN9ZxLkBPSQfAU8At43D59JE4QHGge+BR+/79J1jxSY2rQCdZ3flgReBFYFRq8IAg9GYRCrN2MhFRNw8VLrEdOAV4GTnuV0vTXvp9UNXmJRMePoEXjbR3AJiY4ZJz72I0WlQ+fZnYge+KajRccJxDfgFWHvxvs2/TnQ6RgFSc5ZOBx5AwKizDm4CjTQP46HHcZZdDwh5hOWA0tTcpXtHLvzZWwL9P6xvWntHWmtVjUZjpzm32jSf/NDYsZKxZoKxZoKtFYytFY1tpI21ltA0dbZXLyS1Xl+dKADAs5VCbphSqRRvvfW2LJPJOC0tLeE9e/ZEBgYuiCuVCmfPniWbzWLbBq7rks/nOXHiBJ7nESYIQ1KpFAC7d+/GcRzCMKRYLIrh4WEKhYIoFArk8/mGhTudiAYQTpw40TI0NOQ3Nzf7iYRKJJN+S0uLn06ng0wmE+TzeX9oaMj3PM8fHx/3NU37qqqGmUwmSCaTQVtbW9De3h74vu9rmhYkEgk/Ho8HiUTCz2azfiaTCXp7e/1sNttwHEcHgQgIgkAIIUQYhoJGw7KM5HI5I51OW5qmGYqiGJFIxFRV1RRCmEIIM5lMmrFYzFQUxXRd1+zo6DC7u7tN13VNSZJMx3G83t5er62tzevs7HS7urpcRVE8VVVdRVE8TdM8TdPcXC7nZjIZN5lMevl83s3lcq5lWTmgKwbsAWYVi0Xt3LlzWjQadUzTNFKplCvLsquqqptIJFzbtt1IJOJ2dna6PT09biqVcrPZrJvP593u7m53xowZbiqVcmOxmGvbthePx11N09xIJOLatu0aluWlGRbphBCCOI5DMpl0U6mUJ0mSl0qlPMdxvGg06qmq6lqW5aTTaSedTjuO43iWZXm2bXuJRMJTVdVVFMXVdd3VNM0LwzCYaMwQAM/zMMlBHQA2ABw9ejS8cOGCsCxL+L7veZ6XbIxbEyY3bF8sFnNd1/UikYjnOI7X2trqK4riCyGCMAyDMAyDMAyDtrY2/7Isv9HEJaAExAqFgqFpmqnruhGGoWnbtmmapiGEMIEowAygJKbcdykANpAEzgPtAz/tozS0n+LQfoqFQYrFX8i2L6ZzyQrSC5aSXbiM7IJlZBdcR3/fKvr7XqK/7wX6+zbR3/csgUgTWboe2W0BuoB+4EzjWQEiUsPlX4EbgFejZj9RsxfXuhn35g14c5cQuHE8RaGiSDQpCsIXhOUCYXkQm6jA9LYJsLT+bN78uFYq4ioaNDdB6EHog+9CzQXfg7oHnkuFMrM2PU7tpjUARaAG1OtUGm8mxJTOLUDm+9/OIpQSQo5AJAJuGeouuFWo1QEHXA9qDgFCTH79YaCmTHltBzAKjAFFoDIZIJpIHwFCM1rHkMsglcCvgVuBmg11F+ouVB2oOVB1oVrFuL76GLAf2AJ8QgNgcoRUoH6873dCg5wFKQNyBPwo+DE8KQJ+lDqwtA5QBLYA7wJHJtxMPkDjr/QqsA1BDFgK9AFrgNuBx4BnuAIgiSmj9ALwDfAhsLdBfRlAbFqzOhAHLNF4iav9R/a/tv8A6mJ+gXV+PmYAAAAASUVORK5CYII=') },
        opacity: { value: 0.8 },
        reveal: { value: revealValue / 100 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float reveal;
        void main() {
          vColor = vec3(0.667, 1.0, 0.533); // Toxic green glow
          
          // Scale size based on reveal value - particles grow smaller as character is revealed
          float dynamicSize = size * (1.0 - reveal);
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = dynamicSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D pointTexture;
        uniform float opacity;
        uniform float reveal;
        varying vec3 vColor;
        void main() {
          // Sample the texture
          gl_FragColor = vec4(vColor, opacity * (1.0 - reveal));
          gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
          
          // Apply reveal opacity
          if (gl_FragColor.a < 0.1) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particleSystemRef.current = particles;
  };
  
  // Update particle effect
  const updateParticleEffect = (revealValue: number) => {
    if (!particleSystemRef.current) return;
    
    const particles = particleSystemRef.current;
    if (particles.material instanceof THREE.ShaderMaterial) {
      // Update uniforms
      particles.material.uniforms.reveal.value = revealValue / 100;
      
      // Scale particles inversely to reveal value
      const scale = 1 + (0.5 * (100 - revealValue) / 100);
      particles.scale.set(scale, scale, scale);
      
      // Rotate particles slowly for effect
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;
    }
  };
  
  // Load both models
  const loadModels = (scene: THREE.Scene) => {
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
        const scale = 3.0 / maxDim;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        
        // Apply radiation material
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Create glowing radiation material
            const radiationMaterial = new THREE.MeshPhongMaterial({
              color: new THREE.Color(0xaaff88),
              emissive: new THREE.Color(0x113311),
              emissiveIntensity: 0.4,
              transparent: true,
              opacity: Math.max(0, Math.min(1, 1 - (revealValue / 100))),
              shininess: 30
            });
            
            // Store original material for reference
            if (!child.userData.originalMaterial) {
              child.userData.originalMaterial = child.material;
            }
            
            // Apply the new material
            if (Array.isArray(child.material)) {
              child.material = Array(child.material.length).fill(radiationMaterial);
            } else {
              child.material = radiationMaterial;
            }
          }
        });
        
        // Store the radiation model reference
        setRadiationModel(gltf.scene);
        
        // Add to scene
        scene.add(gltf.scene);
        
        // Increment loaded count
        loadedCount++;
        if (loadedCount === 2) {
          setLoading(false);
        }
      },
      (xhr) => {
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
        const scale = 2.8 / maxDim;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        
        // Apply enhanced material to character model
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Store original material
            if (!child.userData.originalMaterial) {
              child.userData.originalMaterial = child.material.clone();
            }
            
            // Set initial opacity based on reveal value
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.transparent = true;
                mat.opacity = Math.max(0, Math.min(1, revealValue / 100));
                mat.depthWrite = true;
              });
            } else {
              child.material.transparent = true;
              child.material.opacity = Math.max(0, Math.min(1, revealValue / 100));
              child.material.depthWrite = true;
            }
          }
        });
        
        // Store the character model reference
        setCharacterModel(gltf.scene);
        
        // Add to scene
        scene.add(gltf.scene);
        
        // Increment loaded count
        loadedCount++;
        if (loadedCount === 2) {
          setLoading(false);
        }
      },
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded - Character model`);
      },
      (error) => {
        console.error('Error loading character model:', error);
        setError('Failed to load character model. Please check the URL and try again.');
        setLoading(false);
      }
    );
  };
  
  // Clean up Three.js resources
  const disposeResources = () => {
    if (scene) {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (Array.isArray(object.material)) {
            object.material.forEach(material => {
              if (material && typeof material.dispose === 'function') {
                material.dispose();
              }
            });
          } else if (object.material && typeof object.material.dispose === 'function') {
            object.material.dispose();
          }
        }
      });
    }
    
    if (particleSystemRef.current) {
      if (particleSystemRef.current.geometry) {
        particleSystemRef.current.geometry.dispose();
      }
      if (particleSystemRef.current.material) {
        if (Array.isArray(particleSystemRef.current.material)) {
          particleSystemRef.current.material.forEach(material => {
            if (material && typeof material.dispose === 'function') {
              material.dispose();
            }
          });
        } else if (particleSystemRef.current.material && typeof particleSystemRef.current.material.dispose === 'function') {
          particleSystemRef.current.material.dispose();
        }
      }
    }
    
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
    
    if (controlsRef.current) {
      controlsRef.current.dispose();
    }
    
    if (mixer) {
      mixer.stopAllAction();
    }
  };
  
  // Render component
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
