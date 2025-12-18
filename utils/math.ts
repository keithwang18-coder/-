import * as THREE from 'three';

export const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate a random point inside a cone (for the tree leaves)
export const getConePoint = (height: number, radiusBase: number): [number, number, number] => {
  const y = Math.random() * height; // Height from bottom (0 to height)
  const r = (radiusBase * (height - y)) / height; // Radius at this height
  const theta = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * r; // Uniform distribution in circle
  
  const x = radius * Math.cos(theta);
  const z = radius * Math.sin(theta);
  
  // Center the tree vertically around 0
  return [x, y - height / 2, z];
};

// Generate a point on a spiral (for the ribbon)
export const getSpiralPoint = (t: number, height: number, radiusBase: number, turns: number): [number, number, number] => {
  // t is 0 to 1
  const y = t * height - height / 2;
  const r = (radiusBase * (1 - t)) + 0.5; // Slight offset so it's outside
  const theta = t * Math.PI * 2 * turns;
  
  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);
  
  return [x, y, z];
};

// Generate random point in a large sphere (for explosion)
export const getSpherePoint = (radius: number): [number, number, number] => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  
  const sinPhi = Math.sin(phi);
  return [
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  ];
};