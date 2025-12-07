import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import { AppState } from '../types';
import { CONFIG, COLORS } from '../constants';

interface SceneProps {
  appState: AppState;
}

const Scene: React.FC<SceneProps> = ({ appState }) => {
  const controlsRef = useRef<any>(null);
  
  // Camera animation
  useFrame((state) => {
     if (controlsRef.current) {
         // Slow auto rotation for cinematic feel
         controlsRef.current.autoRotate = true;
         controlsRef.current.autoRotateSpeed = 0.3;
     }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, CONFIG.cameraZ]} fov={50} />
      <OrbitControls 
        ref={controlsRef} 
        enablePan={false} 
        maxDistance={40} 
        minDistance={10} 
        maxPolarAngle={Math.PI / 1.5}
      />
      
      {/* Lighting - Solid & Colorful */}
      <ambientLight intensity={0.8} color={COLORS.purple} />
      
      {/* Key Light (Warm) - Reduced intensity slightly to prevent blowout */}
      <pointLight position={[10, 10, 10]} intensity={1.5} color={COLORS.magenta} decay={2} distance={50} />
      
      {/* Fill Light (Cool) */}
      <pointLight position={[-10, 5, -10]} intensity={1.5} color={COLORS.cyan} decay={2} distance={50} />
      
      {/* Top Light (Gold/White) - Focused beam */}
      <spotLight 
        position={[0, 20, 0]} 
        intensity={1.0} 
        angle={0.6} 
        penumbra={0.5} 
        color={COLORS.gold} 
        castShadow 
      />
      
      {/* Environment for reflections, kept dark to let colors pop */}
      <Environment preset="city" background={false} environmentIntensity={0.8} />

      {/* Main Content */}
      <group position={[0, -2, 0]}> 
        <Float 
            speed={appState === AppState.SCATTERED ? 3 : 1.5} 
            rotationIntensity={appState === AppState.SCATTERED ? 0.8 : 0.2} 
            floatIntensity={appState === AppState.SCATTERED ? 1.5 : 0.5}
        >
            <Foliage appState={appState} />
            <Ornaments appState={appState} />
        </Float>
      </group>

      {/* Post Processing */}
      <EffectComposer disableNormalPass>
        {/* Bloom - Tamed for solid colors */}
        <Bloom 
            luminanceThreshold={0.8} // Only bloom very bright things
            mipmapBlur 
            intensity={1.2} 
            radius={0.4} // Smaller radius keeps edges sharper
        />
        
        {/* Chromatic Aberration for style */}
        <ChromaticAberration 
            offset={new Vector2(0.0015, 0.0015)}
            radialModulation={false}
            modulationOffset={0}
        />
        
        <Vignette eskil={false} offset={0.1} darkness={1.0} />
        <Noise opacity={0.05} />
      </EffectComposer>
      
      {/* Background Color override */}
      <color attach="background" args={[COLORS.bg]} />
      {/* Fog to blend depth, but start further back to keep foreground clear */}
      <fog attach="fog" args={[COLORS.bg, 15, 50]} />
    </>
  );
};

export default Scene;