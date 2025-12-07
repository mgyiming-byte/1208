import * as THREE from 'three';

export enum AppState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface ParticleData {
  scatterPosition: THREE.Vector3;
  treePosition: THREE.Vector3;
  color: THREE.Color;
  size: number;
  random: number;
}

export interface OrnamentData {
  id: string;
  type: 'BOX' | 'SPHERE' | 'STAR';
  scatterPosition: THREE.Vector3;
  treePosition: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  color: string;
}

export interface Uniforms {
  uTime: { value: number };
  uProgress: { value: number }; // 0 = Scattered, 1 = Tree
  uColorDeep: { value: THREE.Color };
  uColorGold: { value: THREE.Color };
}