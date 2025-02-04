
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BlackHoleAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const torusRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    containerRef.current.appendChild(renderer.domElement);

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 5000;
    const starsPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPositions[i] = (Math.random() - 0.5) * 100;      // x
      starsPositions[i + 1] = (Math.random() - 0.5) * 100;  // y
      starsPositions[i + 2] = (Math.random() - 0.5) * 100;  // z
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.1,
      sizeAttenuation: true
    });

    starsRef.current = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsRef.current);

    // Create black hole (torus)
    const torusGeometry = new THREE.TorusGeometry(5, 2, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      transparent: true,
      opacity: 0.8
    });
    torusRef.current = new THREE.Mesh(torusGeometry, torusMaterial);
    torusRef.current.rotation.x = Math.PI / 2;
    scene.add(torusRef.current);

    // Position camera
    camera.position.z = 30;

    // Animation
    const animate = () => {
      if (!scene || !camera || !renderer) return;
      
      const animationId = requestAnimationFrame(animate);

      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0003;
      }

      if (torusRef.current) {
        torusRef.current.rotation.z += 0.001;
      }

      renderer.render(scene, camera);

      return () => {
        cancelAnimationFrame(animationId);
      };
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      if (starsRef.current) {
        starsRef.current.geometry.dispose();
        (starsRef.current.material as THREE.Material).dispose();
      }

      if (torusRef.current) {
        torusRef.current.geometry.dispose();
        (torusRef.current.material as THREE.Material).dispose();
      }

      scene.clear();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default BlackHoleAnimation;
