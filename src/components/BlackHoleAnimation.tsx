
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BlackHoleAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1); // Set clear color to black
    containerRef.current.appendChild(renderer.domElement);

    // Enhanced stars with better depth distribution
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const starsVertices = [];
    for (let i = 0; i < 50000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = -Math.random() * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Enhanced singularity effect with dramatic colors
    const diskGeometry = new THREE.TorusGeometry(12, 6, 128, 128);
    const diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 uv = vUv;
          float t = time * 0.3;
          
          float angle = atan(vPosition.y, vPosition.x);
          float dist = length(vPosition.xy);
          
          vec3 purple1 = vec3(0.608, 0.529, 0.961);    // #9b87f5
          vec3 purple2 = vec3(0.494, 0.412, 0.671);    // #7E69AB
          vec3 purple3 = vec3(0.431, 0.349, 0.647);    // #6E59A5
          vec3 vividPurple = vec3(0.545, 0.361, 0.965); // #8B5CF6
          vec3 magentaPink = vec3(0.851, 0.275, 0.937); // #D946EF
          vec3 brightOrange = vec3(0.976, 0.451, 0.086); // #F97316
          
          float singularityPulse = sin(dist * 2.0 - time * 3.0) * 0.5 + 0.5;
          float horizonGlow = exp(-dist * 0.15) * 2.5;
          
          float colorMix = sin(dist * 1.5 + angle * 6.0 + t) * 0.5 + 0.5;
          float secondMix = cos(dist * 2.0 - angle * 4.0 - t * 1.5) * 0.5 + 0.5;
          
          vec3 baseColor = mix(purple1, vividPurple, colorMix);
          baseColor = mix(baseColor, magentaPink, secondMix * singularityPulse);
          
          vec3 horizonColor = mix(brightOrange, magentaPink, sin(time + angle) * 0.5 + 0.5);
          baseColor += horizonColor * horizonGlow * singularityPulse;
          
          float opacity = smoothstep(8.0, 0.0, dist) * 0.95;
          opacity *= 1.0 - pow(sin(angle * 12.0 + t * 2.0) * 0.5 + 0.5, 3.0);
          
          gl_FragColor = vec4(baseColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 3;
    disk.position.y = -5;
    scene.add(disk);

    camera.position.z = 30;
    camera.position.y = 5;
    camera.lookAt(0, -5, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      
      disk.rotation.z += 0.001;
      stars.rotation.z -= 0.0001;
      
      (diskMaterial.uniforms.time as { value: number }).value += 0.01;
      
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10 bg-black" />;
};

export default BlackHoleAnimation;
