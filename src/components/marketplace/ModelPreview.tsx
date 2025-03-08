<lov-code>
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
  // Transform revealValue to use the correct logic:
  // High revealValue = less radiation
  // Low revealValue = more radiation
  // We use 100 - revealValue for actual radiation level in the 3D scene
  const actualRadiationLevel = 100 - revealValue;
  
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
  const [transitionEffect, setTransitionEffect] = useState<THREE.ShaderMaterial | null>(null);
  const [transitionMesh, setTransitionMesh] = useState<THREE.Mesh | null>(null);
  const [lastRevealValue, setLastRevealValue] = useState(revealValue);
  const [transitionDirection, setTransitionDirection] = useState<'increasing' | 'decreasing' | null>(null);
  const [particleSystem, setParticleSystem] = useState<THREE.Points | null>(null);
  
  // Create a buffer to smooth the transition
  const smoothedRevealValue = useRef(revealValue);
  
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
  
  // Check for transition direction
  useEffect(() => {
    if (revealValue !== lastRevealValue) {
      setTransitionDirection(revealValue > lastRevealValue ? 'increasing' : 'decreasing');
      setLastRevealValue(revealValue);
    }
  }, [revealValue, lastRevealValue]);
  
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
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.6);
    newScene.add(ambientLight);
    
    // Add directional light with increased intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);
    
    // Add point lights for better 3D definition
    const pointLight1 = new THREE.PointLight(0xffffff, 0.8);
    pointLight1.position.set(2, 1, 3);
    newScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    pointLight2.position.set(-2, 2, -1);
    newScene.add(pointLight2);
    
    // Add a subtle radiation-colored point light - using toxic green color
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
    
    // Create particle system for transition effects
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
    
    // Create particle material with glow effect - ensure toxic green color
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xaaff88) }, // Toxic green color
        pointTexture: { value: new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTEyLTAzVDE5OjM4OjU4LTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0xMi0wM1QxOTozOToyOC0wODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0xMi0wM1QxOTozOToyOC0wODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmMzIwOGU0YS01OTVmLTRi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') },
        opacity: { value: 0.8 },
        reveal: { value: actualRadiationLevel / 100 } // Use the inverse of revealValue
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float reveal;
        void main() {
          vColor = vec3(0.667, 1.0, 0.533); // Toxic green glow
          
          // Scale size based on reveal value - particles grow larger as radiation increases
          float dynamicSize = size * reveal;
          
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
          gl_FragColor = vec4(vColor, opacity * reveal);
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
    newScene.add(particles);
    setParticleSystem(particles);
    
    // Create a fullscreen quad for transition effects
    const transitionGeometry = new THREE.PlaneGeometry(5, 5);
    const transitionMat = new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        revealTexture: { value: null },
        mixRatio: { value: 0.0 },
        threshold: { value: 0.1 },
        useTexture: { value: 0.0 },
        revealValue: { value: revealValue / 100 },
        transitionDirection: { value: transitionDirection === 'increasing' ? 1.0 : 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float revealValue;
        uniform float transitionDirection;
        varying vec2 vUv;
        
        void main() {
          // This shader doesn't render anything directly
          // It's just a placeholder for more complex transition effects
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `,
      transparent: true,
      opacity: 0
    });
    
    const transitionPlane = new THREE.Mesh(transitionGeometry, transitionMat);
    transitionPlane.visible = false; // Hidden by default
    newScene.add(transitionPlane);
    setTransitionMesh(transitionPlane);
    setTransitionEffect(transitionMat);
    
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
        
        // Apply enhanced material for the radiation cloud
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Create new glow material for radiation cloud - using toxic green color
            const radiationMaterial = new THREE.MeshPhongMaterial({
              color: new THREE.Color(0xaaff88), // Toxic green
              emissive: new THREE.Color(0x113311), // Subtle green glow
              emissiveIntensity: 0.4,
              transparent: true,
              opacity: actualRadiationLevel / 100, // Use the actual radiation level
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
        newScene.add(gltf.scene);
        
        // Add glow effect for radiation cloud - in toxic green
        const radiationGlowMaterial = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: new THREE.Color(0xaaff88) }, // Toxic green
            viewVector: { value: new THREE.Vector3(0, 0, 1) },
            c: { value: 0.2 },
            p: { value: 4.5 },
            opacity: { value: actualRadiationLevel / 100 } // Use the actual radiation level
          },
          vertexShader: `
            uniform vec3 viewVector;
            uniform float c;
            uniform float p;
            varying float intensity;
            void main() {
              vec3 vNormal = normalize(normalMatrix * normal);
              vec3 vNormel = normalize(normalMatrix * viewVector);
              intensity = pow(c - dot(vNormal, vNormel), p);\n              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n            }\n          `,\n          fragmentShader: `\n            uniform vec3 color;\n            uniform float opacity;\n            varying float intensity;\n            void main() {\n              vec3 glow = color * intensity;\n              gl_FragColor = vec4(glow, opacity);\n            }\n          `,\n          side: THREE.BackSide,\n          blending: THREE.AdditiveBlending,\n          transparent: true\n        });\n        \n        // Increment loaded count\n        loadedCount++;\n        if (loadedCount === 2) {\n          setLoading(false);\n        }\n      },\n      (xhr) => {\n        // Progress callback for radiation cloud\n        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded - Radiation cloud`);\n      },\n      (error) => {\n        console.error('Error loading radiation cloud model:', error);\n        setError('Failed to load radiation cloud. Please check the URL and try again.');\n        setLoading(false);\n      }\n    );\n    \n    // Load character model\n    console.log('Loading character model from:', processedModelUrl);\n    loader.load(\n      processedModelUrl,\n      (gltf) => {\n        // Center the model\n        const box = new THREE.Box3().setFromObject(gltf.scene);\n        const center = box.getCenter(new THREE.Vector3());\n        const size = box.getSize(new THREE.Vector3());\n        \n        // Normalize and center\n        const maxDim = Math.max(size.x, size.y, size.z);\n        const scale = 2.8 / maxDim; // Set appropriate scale\n        gltf.scene.scale.set(scale, scale, scale);\n        gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);\n        \n        // Apply material to character model with reveal-based effects\n        gltf.scene.traverse((child) => {\n          if (child instanceof THREE.Mesh) {\n            // Store original material for reference\n            if (!child.userData.originalMaterial) {\n              child.userData.originalMaterial = child.material.clone();\n            }\n            \n            // For character model, create a material that becomes more visible as radiation decreases\n            if (Array.isArray(child.material)) {\n              child.material.forEach(mat => {\n                mat.transparent = true;\n                mat.opacity = (100 - actualRadiationLevel) / 100; // Inverse of radiation level\n                mat.emissiveIntensity = 0.2 * ((100 - actualRadiationLevel) / 100); // Increase glow as revealed\n              });\n            } else {\n              child.material.transparent = true;\n              child.material.opacity = (100 - actualRadiationLevel) / 100; // Inverse of radiation level\n              child.material.emissiveIntensity = 0.2 * ((100 - actualRadiationLevel) / 100); // Increase glow as revealed\n            }\n          }\n        });\n        \n        // Store the character model reference\n        setCharacterModel(gltf.scene);\n        \n        // Add to scene\n        newScene.add(gltf.scene);\n        \n        // Increment loaded count\n        loadedCount++;\n        if (loadedCount === 2) {\n          setLoading(false);\n        }\n      },\n      (xhr) => {\n        // Progress callback for character model\n        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded - Character model`);\n      },\n      (error) => {\n        console.error('Error loading character model:', error);\n        setError('Failed to load character model. Please check the URL and try again.');\n        setLoading(false);\n      }\n    );\n    \n    // Create a smooth transition effect using LERP\n    const smoothTransition = (current, target, factor = 0.05) => {\n      return current + (target - current) * factor;\n    };\n    \n    // Animation loop\n    const animate = () => {\n      const animationId = requestAnimationFrame(animate);\n      \n      // Update mixer for animations\n      if (mixer) {\n        const delta = clock.getDelta();\n        mixer.update(delta);\n      }\n      \n      // LERP the smoothedRevealValue\n      smoothedRevealValue.current = smoothTransition(smoothedRevealValue.current, revealValue);\n      const smoothedRadiationLevel = 100 - smoothedRevealValue.current; // Convert to radiation level\n      \n      // Update particle system\n      if (particleSystem && particleSystem.material instanceof THREE.ShaderMaterial) {\n        particleSystem.material.uniforms.reveal.value = smoothedRadiationLevel / 100;\n        \n        // Scale and position particles based on radiation level\n        particleSystem.scale.set(\n          1 + (0.5 * smoothedRadiationLevel / 100),\n          1 + (0.5 * smoothedRadiationLevel / 100),\n          1 + (0.5 * smoothedRadiationLevel / 100)\n        );\n        \n        // Rotate particles slowly\n        particleSystem.rotation.y += 0.001;\n        particleSystem.rotation.x += 0.0005;\n      }\n      \n      // Update radiation model opacity\n      if (radiationModel) {\n        radiationModel.traverse((child) => {\n          if (child instanceof THREE.Mesh) {\n            // Calculate opacity with smooth transition\n            const targetOpacity = smoothedRadiationLevel / 100;\n            \n            if (Array.isArray(child.material)) {\n              child.material.forEach(mat => {\n                // Smoothly transition opacity\n                mat.opacity = targetOpacity;\n                // Adjust emissive intensity for glow effect\n                mat.emissiveIntensity = 0.4 * targetOpacity;\n              });\n            } else {\n              // Smoothly transition opacity\n              child.material.opacity = targetOpacity;\n              // Adjust emissive intensity for glow effect\n              child.material.emissiveIntensity = 0.4 * targetOpacity;\n            }\n          }\n        });\n      }\n      \n      // Update character model opacity and effects\n      if (characterModel) {\n        characterModel.traverse((child) => {\n          if (child instanceof THREE.Mesh) {\n            // Calculate opacity with smooth transition - character is visible when radiation is low\n            const targetOpacity = (100 - smoothedRadiationLevel) / 100;\n            \n            if (Array.isArray(child.material)) {\n              child.material.forEach(mat => {\n                // Smoothly transition opacity\n                mat.opacity = targetOpacity;\n                // Enhance material properties as character is revealed\n                mat.emissiveIntensity = 0.2 * targetOpacity;\n                mat.shininess = 10 + (20 * targetOpacity);\n              });\n            } else {\n              // Smoothly transition opacity\n              child.material.opacity = targetOpacity;\n              // Enhance material properties as character is revealed\n              child.material.emissiveIntensity = 0.2 * targetOpacity;\n              if (child.material.shininess !== undefined) {\n                child.material.shininess = 10 + (20 * targetOpacity);\n              }\n            }\n          }\n        });\n      }\n      \n      // Update transition effect if available\n      if (transitionEffect) {\n        transitionEffect.uniforms.revealValue.value = (100 - smoothedRadiationLevel) / 100;\n        transitionEffect.uniforms.transitionDirection.value = \n          transitionDirection === 'increasing' ? 1.0 : 0.0;\n      }\n      \n      // Update controls and render\n      controls.update();\
