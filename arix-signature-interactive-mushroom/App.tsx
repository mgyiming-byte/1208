import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SCATTERED);

  const toggleState = () => {
    setAppState((prev) => 
      prev === AppState.SCATTERED ? AppState.TREE_SHAPE : AppState.SCATTERED
    );
  };

  return (
    <div className="relative w-full h-screen bg-black">
      
      {/* 3D Canvas */}
      <Canvas
        dpr={[1, 2]} // Support high DPI
        gl={{ 
            antialias: false, // Post-processing handles AA
            toneMapping: 3, // ACESFilmic
            toneMappingExposure: 0.9 // Lower exposure for deeper colors
        }} 
      >
        <Scene appState={appState} />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
        
        {/* Header */}
        <header className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 animate-fade-in">
            {/* Subtitle / Greeting - Significantly increased size */}
            <h2 className="text-fuchsia-400 tracking-[0.15em] text-2xl md:text-4xl font-bold drop-shadow-md mb-2">
                蘑菇同志，生日快乐！
            </h2>
            
            {/* Main Title / Message */}
            <h1 className="text-5xl md:text-7xl text-white font-serif tracking-tighter drop-shadow-[0_0_15px_rgba(217,3,104,0.8)] leading-tight">
                你是我的<br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300 ml-0 md:ml-4">
                    珍宝
                </span>
            </h1>
            
            <p className="text-cyan-100/60 max-w-md text-xs md:text-sm font-light tracking-widest uppercase opacity-80 mt-2">
                My Precious Treasure
            </p>
        </header>

        {/* Controls */}
        <div className="flex flex-col items-center md:items-end pointer-events-auto">
            <div className="bg-white/5 border border-white/20 p-1 backdrop-blur-xl rounded-full shadow-[0_0_40px_rgba(110,13,208,0.4)]">
                <button 
                    onClick={toggleState}
                    className="group relative px-10 py-3 rounded-full overflow-hidden transition-all duration-700 ease-out"
                >
                    {/* Button Background Gradient */}
                    <div className={`absolute inset-0 w-full h-full bg-gradient-to-r from-fuchsia-700 to-cyan-700 transition-opacity duration-700 ${appState === AppState.TREE_SHAPE ? 'opacity-100' : 'opacity-20'}`}></div>
                    
                    {/* Noise Texture */}
                    <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                    
                    <span className={`relative font-serif font-bold tracking-widest text-sm transition-colors duration-300 ${appState === AppState.TREE_SHAPE ? 'text-white' : 'text-cyan-400'}`}>
                        {appState === AppState.SCATTERED ? 'CRYSTALLIZE' : 'DISSOLVE'}
                    </span>
                    
                    {/* Shine Effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                </button>
            </div>
            
            <div className="mt-4 text-xs text-fuchsia-300/50 font-mono tracking-widest">
                STATUS: {appState === AppState.SCATTERED ? 'DISPERSED' : 'SOLIDIFIED'}
            </div>
        </div>

      </div>
      
      {/* Decorative borders */}
      <div className="absolute top-0 left-0 w-full h-full border-[1px] border-cyan-500/20 pointer-events-none m-4 md:m-6 w-[calc(100%-2rem)] h-[calc(100%-2rem)] md:w-[calc(100%-3rem)] md:h-[calc(100%-3rem)] box-border rounded-lg mix-blend-screen"></div>
    </div>
  );
};

export default App;