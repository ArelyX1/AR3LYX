import React, { useEffect, useRef } from 'react';

interface ShikinamiProps {
  width?: string | number;
  speed?: number;
  className?: string;
  isActive: boolean; // El 'started' de Strudel
}

export const ShikinamiAnimation: React.FC<ShikinamiProps> = ({ 
  width = '400px', 
  speed = 1.0, 
  className, 
  isActive 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Ref para memorizar el estado anterior sin provocar re-renders
  const wasActive = useRef<boolean>(isActive);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Lógica de detección de Flancos (Edge Detection)
    const justStarted = isActive && !wasActive.current;
    const justStopped = !isActive && wasActive.current;

    if (justStarted) {
      // SOLO ocurre cuando pasas de Stop a Play
      video.currentTime = 0;
      video.play().catch((err) => console.log("Video play bloqueado:", err));
    } else if (isActive && video.paused) {
      // Si ya estaba activo pero el navegador lo pausó, le damos play
      video.play().catch(() => {});
    }

    if (justStopped) {
      // Cuando le das a Stop en Strudel
      video.pause();
    }

    // Actualizamos la "memoria" para la próxima evaluación
    wasActive.current = isActive;
  }, [isActive]); // Solo reacciona cuando el botón de Play/Stop cambia

  // Manejo de la velocidad (independiente del reinicio)
  useEffect(() => {
    if (videoRef.current) {
      // Aseguramos que el speed sea un número válido y mayor a 0.06 (límite de Chrome)
      videoRef.current.playbackRate = Math.max(speed, 0.1) || 1.0;
    }
  }, [speed]);

  return (
    <div className={className} style={{ width }}>
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        // Eliminamos autoPlay para evitar que se reproduzca solo en updates
        style={{ 
          width: '100%', 
          display: 'block', 
          background: 'transparent',
          pointerEvents: 'none' // Para que no interfiera con el mouse
        }}
      >
        <source src="/src/fiver/nightcoregirl.webm" type="video/webm" />
        Tu navegador no soporta video.
      </video>
    </div>
  );
};