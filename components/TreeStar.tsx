import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles } from '@react-three/drei';

// Warm Yellow Color (Gold)
const WARM_YELLOW = "#FFD700"; 

export const TreeStar: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom 5-pointed star shape
  const starShape = React.useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.8;
    const innerRadius = 0.4;
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (points * 2)) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 2
  };

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.z = Math.sin(t) * 0.1;
      
      // Float
      meshRef.current.position.y = 6.5 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 6.5, 0]}>
        <extrudeGeometry args={[starShape, extrudeSettings]} />
        <meshStandardMaterial 
          color={WARM_YELLOW}
          emissive={WARM_YELLOW}
          emissiveIntensity={2.1} // Reduced by ~30% (from 3.0)
          toneMapped={false} 
        />
      </mesh>
      
      {/* Sparkles around the star */}
      <Sparkles 
        position={[0, 6.5, 0]} 
        count={80} 
        scale={3.5} 
        size={5} 
        speed={0.6} 
        opacity={1}
        color={WARM_YELLOW}
      />
    </group>
  );
};