import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export enum AppState {
  INTRO = 'INTRO',
  EXPERIENCE = 'EXPERIENCE'
}

export enum TreeMode {
  TREE = 'TREE',
  EXPLODE = 'EXPLODE'
}

export interface ParticleData {
  initialPos: [number, number, number];
  targetPos: [number, number, number]; // Tree position
  explodePos: [number, number, number]; // Chaos position
  scale: number;
  color: string;
  speed: number; // For rotation or movement variance
}