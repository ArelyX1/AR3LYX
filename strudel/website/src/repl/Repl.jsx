import React, { useRef, useEffect, useState } from 'react';
import { isIframe, isUdels } from './util.mjs';
import UdelsEditor from '@components/Udels/UdelsEditor';
import ReplEditor from './components/ReplEditor';
import EmbeddedReplEditor from './components/EmbeddedReplEditor';
import { useReplContext } from './useReplContext';
import { useSettings } from '@src/settings.mjs';



// --- VISUALIZADOR 3D FUTURISTA ARE3LYX ---
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { BkCubesBox } from './three/views/BkCubeBox';
import { Marquee } from './three/components/TopMarquee';
import { AudioVisualizer } from './three/components/AudioVisualizer';
import { useMeyda } from './three/hooks/useMeyda';
import { useBoxControls } from './three/hooks/useBoxControls';
import { TDStream } from './three/components/TDStream';
import { ShikinamiAnimation } from './three/components/ShikinamiAnimation';
import { tune } from '@strudel/xen/tune.mjs';


function TetoPear({ path }) {
  const { scene } = useGLTF(path);
  const group = useRef(null);
  
  // Establecemos la escala del modelo
  scene.scale.set(1, 1, 1);
  
  return <primitive ref={group} object={scene} dispose={null} />;
}

export function TetoCorner() {
  return (
    <Canvas 
      camera={{ position: [2, 2, 8], fov: 37 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 16, 30]} intensity={10} />
      <directionalLight position={[-60, 40, -50]} intensity={10} />
      <directionalLight position={[6, -10, -0]} intensity={10} />
      <TetoPear path="/src/fiver/tetocat.glb" />
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={2}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </Canvas>
  );
}

// --- COMPONENTE REPL PRINCIPAL ---
export function Repl({ embedded = false }) {
  const isEmbedded = embedded || isIframe();
  const Editor = isUdels() ? UdelsEditor : isEmbedded ? EmbeddedReplEditor : ReplEditor;
  const context = useReplContext();
  const { started } = context;
  const { fontFamily } = useSettings();
  const { volume, audioData, isActive, start, stop } = useMeyda();
  const settings = useBoxControls({ isActive, start, stop });

  return (
    <div className="repl-container" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div className="teto-background fixed inset-0 z-[-999999999999999999999] pointer-events-none">
        <BkCubesBox />
      </div>
      
      <div className="marquee-fixed">
        <Marquee />
      </div>

      
      {/* Visualizador en la capa de abajo */}
      
      <div className="teto-corner fixed bottom-0 right-0 w-330 h-330 md:w-104 md:h-104 lg:w-90 lg:h-300 pointer-events-none z-10">
         {/* Le pasamos el volumen para que la bolita se mueva */}
         <AudioVisualizer volume={volume} audioData={audioData} isActive={isActive} />
      </div>

      <div className="teto-corner fixed bottom-0 right-0 w-330 h-330 md:w-104 md:h-104 lg:w-90 lg:h-300 pointer-events-none z-10">
         {/* Le pasamos el volumen para que la bolita se mueva */}

         {/*<TetoCorner />*/}
         <ShikinamiAnimation speed={settings.bpm / 128} isActive={started} />

      </div>
      

      {/* Editor en la capa de arriba */}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        <Editor context={context} style={{ fontFamily }} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Transparencia total del editor */
        .repl-container .cm-editor,
        .repl-container .cm-scroller,
        .repl-container .cm-gutters {
          background-color: transparent !important;
        }
        /* Ajuste de visibilidad del texto */
        .cm-content {
          text-shadow: 0 0 5px rgba(0,0,0,0.8);
        }
      `}} />
    </div>
  );
}