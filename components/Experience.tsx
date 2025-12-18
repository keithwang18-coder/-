import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { TreeParticles } from './TreeParticles';
import { TreeStar } from './TreeStar';
import { TreeMode } from '../types';
import * as THREE from 'three';

interface ExperienceProps {
  treeMode: TreeMode;
  toggleMode: () => void;
}

const RotatingGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow constant rotation regardless of state
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return <group ref={groupRef}>{children}</group>;
};

export const Experience: React.FC<ExperienceProps> = ({ treeMode, toggleMode }) => {
  return (
    <Canvas
      dpr={[1, 2]} 
      gl={{ 
        antialias: false, 
        toneMapping: THREE.ReinhardToneMapping,
        toneMappingExposure: 1.8 
      }}
      className="w-full h-full cursor-pointer"
      onClick={toggleMode}
    >
      <PerspectiveCamera makeDefault position={[0, 2, 28]} fov={50} />
      
      {/* Lighting - Warm Palette Only */}
      <ambientLight intensity={1.5} color="#331015" /> {/* Dark Warm Red-Brown Ambient */}
      <Environment preset="city" />
      
      {/* Main Light - Warm Rose Pink */}
      <spotLight 
        position={[10, 10, -10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={30} 
        color="#F06292" // Lighter Warm Rose
        distance={50}
        decay={1}
      />
      {/* Secondary Light - Soft Champagne/Peach (Replaced cool purple) */}
       <spotLight 
        position={[-10, 8, -10]} 
        angle={0.6} 
        penumbra={1} 
        intensity={22} 
        color="#FFDAB9" // Peach Puff / Champagne
        distance={50}
        decay={1}
      />
      
      {/* Bottom Uplight - Warm White */}
      <pointLight position={[0, -5, 5]} intensity={12} color="#FFF5E1" distance={20} />

      <RotatingGroup>
        <TreeParticles mode={treeMode} />
        <TreeStar />
      </RotatingGroup>

      {/* Shadows */}
      <ContactShadows 
        position={[0, -6.5, 0]} 
        opacity={0.5} 
        scale={40} 
        blur={2.5} 
        far={4.5} 
        color="#000000"
      />

      {/* Post Processing */}
      {/* Fixed: replaced disableNormalPass with enableNormalPass={false} as per type definition */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={1.1} 
          mipmapBlur 
          intensity={1.3} 
          radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.7} />
      </EffectComposer>

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={10} 
        maxDistance={50}
        rotateSpeed={0.5}
        autoRotate={false}
      />
    </Canvas>
  );
};