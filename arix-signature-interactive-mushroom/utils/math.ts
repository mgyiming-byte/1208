import * as THREE from 'three';
import { MUSHROOM_PARAMS, CONFIG } from '../constants';

// Helper to get a random point inside a sphere
export const getRandomScatterPosition = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
};

// Generate a point on the Mushroom surface/volume
export const getMushroomPosition = (): THREE.Vector3 => {
  const isCap = Math.random() > 0.3; // 70% points on cap, 30% on stem

  if (isCap) {
    // Semi-ellipsoid Cap
    // Use rejection sampling or parametric equation for uniform distribution
    // Simplified parametric for aesthetics
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.5; // Top half
    
    // Add some noise to radius for fluffiness
    const rNoise = (Math.random() - 0.5) * MUSHROOM_PARAMS.noiseStrength;
    const r = MUSHROOM_PARAMS.capRadius + rNoise;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const z = r * Math.sin(phi) * Math.sin(theta);
    const y = MUSHROOM_PARAMS.capHeight * Math.cos(phi) + (MUSHROOM_PARAMS.stemHeight / 2);
    
    return new THREE.Vector3(x, y, z);
  } else {
    // Stem (Cylinder)
    const theta = Math.random() * Math.PI * 2;
    const h = (Math.random() - 0.5) * MUSHROOM_PARAMS.stemHeight;
    
    const rNoise = (Math.random() - 0.5) * (MUSHROOM_PARAMS.noiseStrength * 0.5);
    // Slight taper at top
    const taper = 1 - ((h + MUSHROOM_PARAMS.stemHeight/2) / MUSHROOM_PARAMS.stemHeight) * 0.3; 
    const r = (MUSHROOM_PARAMS.stemRadius + rNoise) * taper;

    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);
    const y = h; // Centered at 0 vertically relative to stem height
    
    return new THREE.Vector3(x, y, z);
  }
};
