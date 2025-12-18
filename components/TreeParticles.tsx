import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { TreeMode } from '../types';
import { getConePoint, getSpherePoint, getSpiralPoint, randomRange } from '../utils/math';

interface TreeParticlesProps {
  mode: TreeMode;
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

// Revised Palette: Warm Rose & Soft Cherry
const WARM_ROSE = '#E63968';    // Deep Warm Rose
const SOFT_CHERRY = '#FF9EAA';  // Soft Cherry/Blossom Pink
const CHAMPAGNE_LIGHT = '#FFF0D4'; // Warm Champagne White (Yellow-ish white)

export const TreeParticles: React.FC<TreeParticlesProps> = ({ mode }) => {
  // ----------------------------------------------------------------
  // 1. LEAVES (Octahedrons) - The bulk of the tree
  // ----------------------------------------------------------------
  const leavesCount = 18000; 
  const leavesRef = useRef<THREE.InstancedMesh>(null);
  
  const leavesData = useMemo(() => {
    return new Array(leavesCount).fill(0).map(() => {
      const treePos = getConePoint(12, 4);
      const explodePos = getSpherePoint(15);
      
      // Mix between Warm Rose and Soft Cherry (No cool purples)
      const color = Math.random() > 0.5 ? WARM_ROSE : SOFT_CHERRY;
      
      return {
        treePos: new THREE.Vector3(...treePos),
        explodePos: new THREE.Vector3(...explodePos),
        scale: randomRange(0.015, 0.05),
        color: color,
        speed: randomRange(0.2, 1)
      };
    });
  }, []);

  // ----------------------------------------------------------------
  // 2. ORNAMENTS (Cubes & Icosahedrons) - Shiny gems
  // ----------------------------------------------------------------
  const gemsCount = 3000;
  const gemsRef = useRef<THREE.InstancedMesh>(null);

  const gemsData = useMemo(() => {
    return new Array(gemsCount).fill(0).map(() => {
      const treePosRaw = getConePoint(12, 4.2);
      const treePos = new THREE.Vector3(...treePosRaw); 
      const explodePos = getSpherePoint(20);
      
      // Accents are Champagne White or deep Rose
      return {
        treePos,
        explodePos: new THREE.Vector3(...explodePos),
        scale: randomRange(0.04, 0.08),
        color: Math.random() > 0.3 ? CHAMPAGNE_LIGHT : WARM_ROSE,
        speed: randomRange(0.5, 1.5)
      };
    });
  }, []);

  // ----------------------------------------------------------------
  // 3. RIBBON (Star Shapes) - Spiral Halo
  // ----------------------------------------------------------------
  const ribbonCount = 2000; 
  const ribbonRef = useRef<THREE.InstancedMesh>(null);

  // Generate Star Shape Geometry for the ribbon
  const starShapeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 1;
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
    return new THREE.ShapeGeometry(shape);
  }, []);

  const ribbonData = useMemo(() => {
    return new Array(ribbonCount).fill(0).map((_, i) => {
      const t = i / ribbonCount;
      const treePos = getSpiralPoint(t, 13, 5.5, 3.5); 
      const explodePos = getSpherePoint(25);
      
      return {
        treePos: new THREE.Vector3(...treePos),
        explodePos: new THREE.Vector3(...explodePos),
        scale: randomRange(0.05, 0.12), 
        color: CHAMPAGNE_LIGHT, 
        speed: randomRange(1, 3) 
      };
    });
  }, []);

  // ----------------------------------------------------------------
  // ANIMATION LOOP
  // ----------------------------------------------------------------
  const progress = useRef(0);

  useFrame((state, delta) => {
    const targetProgress = mode === TreeMode.EXPLODE ? 1 : 0;
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress, delta * 2.5);

    const t = progress.current;
    const time = state.clock.elapsedTime;

    // --- Update Leaves ---
    if (leavesRef.current) {
      leavesData.forEach((d, i) => {
        tempObject.position.lerpVectors(d.treePos, d.explodePos, t);
        tempObject.position.y += Math.sin(time * d.speed + i) * 0.05;
        
        tempObject.rotation.set(
          time * d.speed * 0.2, 
          time * d.speed * 0.1, 
          0
        );
        
        tempObject.scale.setScalar(d.scale * (1 - t * 0.3));
        tempObject.updateMatrix();
        leavesRef.current!.setMatrixAt(i, tempObject.matrix);
      });
      leavesRef.current.instanceMatrix.needsUpdate = true;
    }

    // --- Update Gems ---
    if (gemsRef.current) {
      gemsData.forEach((d, i) => {
        tempObject.position.lerpVectors(d.treePos, d.explodePos, t);
        tempObject.rotation.set(time, time * 0.5, i);
        
        const twinkle = 1 + Math.sin(time * 5 + i) * 0.2;
        tempObject.scale.setScalar(d.scale * twinkle);
        
        tempObject.updateMatrix();
        gemsRef.current!.setMatrixAt(i, tempObject.matrix);
      });
      gemsRef.current.instanceMatrix.needsUpdate = true;
    }

    // --- Update Ribbon (Stars) ---
    if (ribbonRef.current) {
      ribbonData.forEach((d, i) => {
        tempObject.position.lerpVectors(d.treePos, d.explodePos, t);
        
        const flow = Math.sin(time * 3 + i * 0.1) * 0.05;
        tempObject.position.addScalar(flow);
        
        // Spin the stars
        tempObject.rotation.set(0, time * d.speed, 0);
        tempObject.lookAt(state.camera.position); 
        tempObject.rotateZ(time * d.speed); 

        tempObject.scale.setScalar(d.scale);
        tempObject.updateMatrix();
        ribbonRef.current!.setMatrixAt(i, tempObject.matrix);
      });
      ribbonRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  useLayoutEffect(() => {
    if (leavesRef.current) {
      leavesData.forEach((d, i) => {
        tempColor.set(d.color);
        leavesRef.current!.setColorAt(i, tempColor);
      });
      leavesRef.current.instanceMatrix.needsUpdate = true;
    }
    if (gemsRef.current) {
      gemsData.forEach((d, i) => {
        tempColor.set(d.color);
        gemsRef.current!.setColorAt(i, tempColor);
      });
      gemsRef.current.instanceMatrix.needsUpdate = true;
    }
    if (ribbonRef.current) {
      ribbonData.forEach((d, i) => {
        tempColor.set(d.color);
        ribbonRef.current!.setColorAt(i, tempColor);
      });
      ribbonRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [leavesData, gemsData, ribbonData]);

  return (
    <group>
      {/* Ribbon Sparkles - Warm Champagne */}
      <Sparkles 
        count={500}
        scale={16} 
        size={4}
        speed={0.5}
        opacity={0.6}
        color={CHAMPAGNE_LIGHT}
        position={[0, 0, 0]}
      />
      {/* Tree Sparkles - Soft Pink mix */}
       <Sparkles 
        count={500}
        scale={10} 
        size={6}
        speed={0.3}
        opacity={0.5}
        color={SOFT_CHERRY}
        position={[0, 2, 0]}
      />

      {/* Leaves - Warm Rose & Cherry */}
      <instancedMesh ref={leavesRef} args={[undefined, undefined, leavesCount]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          roughness={0.4} 
          metalness={0.6} 
          color="#FFB6C1" // Light Pink Base
          emissive={WARM_ROSE}
          emissiveIntensity={0.3} 
        />
      </instancedMesh>

      {/* Gems - Champagne Accents */}
      <instancedMesh ref={gemsRef} args={[undefined, undefined, gemsCount]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          roughness={0.1} 
          metalness={0.9} 
          emissive={CHAMPAGNE_LIGHT}
          emissiveIntensity={0.5}
        />
      </instancedMesh>

      {/* Ribbon - Star Shapes - Champagne Light */}
      <instancedMesh ref={ribbonRef} args={[starShapeGeometry, undefined, ribbonCount]}>
        <meshBasicMaterial 
          color={CHAMPAGNE_LIGHT}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
};