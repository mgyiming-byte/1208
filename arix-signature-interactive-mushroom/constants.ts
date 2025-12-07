import * as THREE from 'three';

// Palette - Rich, Deep & Solid Luxury
export const COLORS = {
  bg: '#020005', // Almost pure black for contrast
  gold: '#FFD700', // Pure Gold
  magenta: '#D90368', // Deep Pink
  purple: '#6E0DD0', // Electric Purple
  cyan: '#00E5FF', // Neon Cyan
  rose: '#E60073', // Strong Rose
  bronze: '#CD7F32'
};

// Removed White, added deeper, more solid colors
export const PALETTE = [
  new THREE.Color('#FFC000'), // Deep Gold
  new THREE.Color('#E6005C'), // Rich Magenta
  new THREE.Color('#00BFFF'), // Deep Sky Blue
  new THREE.Color('#6600CC'), // Deep Violet
  new THREE.Color('#FF1493'), // Deep Pink
  new THREE.Color('#DC143C'), // Crimson Red
  new THREE.Color('#00FA9A'), // Medium Spring Green (Emerald-ish)
];

// Configuration
export const CONFIG = {
  foliageCount: 15000, // Slightly reduced for solid look, less noise
  ornamentCount: 250, // Increased ornaments for more solid shapes
  scatterRadius: 30,
  cameraZ: 20,
  transitionSpeed: 1.8,
};

// Mushroom Shape Parameters
export const MUSHROOM_PARAMS = {
  capRadius: 7,
  capHeight: 5,
  stemRadius: 1.5,
  stemHeight: 8,
  noiseStrength: 0.6 // Less fluffy, more defined
};

export const BOX_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);
export const SPHERE_GEOMETRY = new THREE.SphereGeometry(1, 32, 32);

// Base Materials 
// Reduced metalness to see more base color, increased roughness for "solid" feel
export const ORNAMENT_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.4, // Less mirror, more plastic/gem
  roughness: 0.2, // Smooth but solid
  envMapIntensity: 1.0,
});