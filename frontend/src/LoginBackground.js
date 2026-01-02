import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function LoginBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    // Add fog to blend the floor into the sky
    scene.fog = new THREE.Fog(0x87CEEB, 10, 40);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      50, 
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // Move camera back slightly to see the whole tree
    camera.position.set(0, 2, 7);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; 
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    currentMount.appendChild(renderer.domElement);

    // 4. Lighting & Sun
    
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional Light (The Sun Source)
    const sunLight = new THREE.DirectionalLight(0xffdfba, 2.5);
    sunLight.position.set(8, 12, -5); // Behind and to the right
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    scene.add(sunLight);

    // VISIBLE SUN (The Glowing Sphere)
    const sunGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 }); // Bright orange-yellow
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.copy(sunLight.position); // Put mesh exactly where light is
    scene.add(sunMesh);

    // SUN GLOW (Fake Sunrays/Halo)
    const glowGeo = new THREE.SphereGeometry(3, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ 
      color: 0xffddaa, 
      transparent: true, 
      opacity: 0.3 
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.copy(sunLight.position);
    scene.add(glowMesh);

    // 5. Floor
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3a5f0b,
      roughness: 1
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0; // Floor is at 0
    plane.receiveShadow = true;
    scene.add(plane);

    // 6. Load Tree
    const loader = new GLTFLoader();
    loader.load(
      'https://3d-model-store.s3.us-east-2.amazonaws.com/models/Tree.glb',
      (gltf) => {
        const model = gltf.scene;
        
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        model.position.set(0, 2, 0); 
        model.scale.set(1.5, 2, 1.5); 

        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading tree:', error);
      }
    );

    // 7. Interactive Camera (Subtle & Inverted)
    let targetX = 0;
    let targetY = 0;
    
    // Reduced sensitivity divisor (4000 instead of 100)
    // Inverted logic is handled in the animate loop
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event) => {
      targetX = (event.clientX - windowHalfX) / 1000; // Much lower sensitivity
      targetY = (event.clientY - windowHalfY) / 1000;
    };

    document.addEventListener('mousemove', onDocumentMouseMove);

    // 8. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Inverted Movement:
      // If mouse goes Right (+), Camera goes Left (-)
      camera.position.x += (-targetX - camera.position.x) * 0.05;
      
      // If mouse goes Down (+), Camera goes Up (-)
      // We keep the base height (+2) and add the offset
      camera.position.y += (-targetY + 2 - camera.position.y) * 0.05;

      camera.lookAt(0, 2, 0); // Look slightly up at the tree trunk/leaves
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      if (currentMount) currentMount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1 }}>
      {/* 3D Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* CITATION TEXT OVERLAY */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '800px',
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: '12px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: '5px 10px',
        borderRadius: '5px',
        pointerEvents: 'none', // Allows clicks to pass through to the scene if needed
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }}>
        Model: "Tree" by Marc Solà [CC-BY] via Poly Pizza
      </div>
    </div>
  );
}

export default LoginBackground;