import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CONFIG } from '../constants';
import { getMushroomPosition, getRandomScatterPosition } from '../utils/math';
import { AppState } from '../types';

// --- SHADERS ---
const foliageVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  
  attribute vec3 aScatterPos;
  attribute vec3 aTreePos;
  attribute float aRandom;
  attribute float aSize;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vRandom;

  void main() {
    vRandom = aRandom;

    // Mix positions
    vec3 pos = mix(aScatterPos, aTreePos, uProgress);
    
    // Add "breathing"
    float breathe = sin(uTime * 1.0 + aRandom * 15.0) * 0.2;
    float wave = cos(pos.x * 0.5 + uTime) * 0.1;
    
    // When scattered, move more chaotically
    float scatterFloat = sin(uTime * 0.3 + aRandom * 30.0) * (1.0 - uProgress) * 2.0;
    
    pos.x += breathe * 0.3 + scatterFloat;
    pos.y += breathe + wave + scatterFloat;
    pos.z += breathe * 0.3 + scatterFloat;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = aSize * (350.0 / -mvPosition.z);
    
    // Twinkle effect on size
    float twinkle = 1.0 + sin(uTime * 3.0 + aRandom * 20.0) * 0.3;
    gl_PointSize *= twinkle;

    vAlpha = 1.0; // Solid alpha
  }
`;

const foliageFragmentShader = `
  varying float vAlpha;
  varying float vRandom;
  uniform float uTime;

  void main() {
    // Harder circular particle
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    if (dist > 0.5) discard;

    // Sharp edge for solid look
    float gradient = smoothstep(0.5, 0.4, dist);
    
    // Color Logic: Deep, Saturated colors
    vec3 gold = vec3(1.0, 0.7, 0.0);
    vec3 magenta = vec3(0.9, 0.0, 0.4);
    vec3 cyan = vec3(0.0, 0.8, 1.0);
    vec3 purple = vec3(0.5, 0.0, 0.8);
    vec3 emerald = vec3(0.0, 0.8, 0.4);

    vec3 finalColor;
    
    // Explicit color zones based on random
    if (vRandom < 0.2) {
        finalColor = mix(gold, magenta, sin(uTime + vRandom * 5.0) * 0.5 + 0.5);
    } else if (vRandom < 0.4) {
        finalColor = mix(purple, cyan, sin(uTime + vRandom * 5.0) * 0.5 + 0.5);
    } else if (vRandom < 0.6) {
        finalColor = emerald;
    } else if (vRandom < 0.8) {
        finalColor = gold;
    } else {
        finalColor = magenta;
    }

    // Minimal brightness boost, prevent white washout
    finalColor *= 1.2; 

    // Very slight highlight, but NOT white
    finalColor += vec3(0.1) * (1.0 - dist * 2.0);

    gl_FragColor = vec4(finalColor, vAlpha * gradient);
  }
`;

interface FoliageProps {
  appState: AppState;
}

const Foliage: React.FC<FoliageProps> = ({ appState }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = CONFIG.foliageCount;

  // Generate attributes once
  const { positions, scatterPositions, treePositions, randoms, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scPos = new Float32Array(count * 3);
    const trPos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Tree position (Target)
      const tPos = getMushroomPosition();
      trPos[i * 3] = tPos.x;
      trPos[i * 3 + 1] = tPos.y;
      trPos[i * 3 + 2] = tPos.z;

      // Scatter position (Source)
      const sPos = getRandomScatterPosition(CONFIG.scatterRadius);
      scPos[i * 3] = sPos.x;
      scPos[i * 3 + 1] = sPos.y;
      scPos[i * 3 + 2] = sPos.z;

      // Initial position (Start at scatter)
      pos[i * 3] = sPos.x;
      pos[i * 3 + 1] = sPos.y;
      pos[i * 3 + 2] = sPos.z;

      rnd[i] = Math.random();
      sz[i] = Math.random() * 2.5 + 1.0; // Larger particles for solid feel
    }

    return {
      positions: pos,
      scatterPositions: scPos,
      treePositions: trPos,
      randoms: rnd,
      sizes: sz
    };
  }, [count]);

  // Uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
  }), []);

  // Animation Loop
  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      const targetProgress = appState === AppState.TREE_SHAPE ? 1.0 : 0.0;
      const currentProgress = materialRef.current.uniforms.uProgress.value;
      const step = delta * CONFIG.transitionSpeed;
      
      if (Math.abs(targetProgress - currentProgress) > 0.001) {
          materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(currentProgress, targetProgress, step);
      }
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aScatterPos" count={count} array={scatterPositions} itemSize={3} />
        <bufferAttribute attach="attributes-aTreePos" count={count} array={treePositions} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" count={count} array={randoms} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={foliageVertexShader}
        fragmentShader={foliageFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        // Changed from Additive to Normal for more solid color retention
        blending={THREE.NormalBlending} 
      />
    </points>
  );
};

export default Foliage;