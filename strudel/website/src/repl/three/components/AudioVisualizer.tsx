import React from 'react';

interface AudioVisualizerProps {
  volume: number;    
  audioData: any;    
  isActive: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ volume, audioData, isActive }) => {
  if (!isActive || !audioData) return <div style={{color: 'white', fontFamily: 'monospace'}}>ESPERANDO AUDIO...</div>;

  const features = [
    { name: 'RMS', val: volume * 100, color: '#ff0087' }, 
    { name: 'ZCR', val: audioData.zcr / 40, color: '#26ccc2' }, 
    { name: 'Centroid', val: audioData.spectralCentroid / 100, color: '#b0fffa' }, 
    { name: 'Rolloff', val: audioData.spectralRolloff / 20000, color: '#ff2dd1' }, 
    { name: 'Flatness', val: audioData.spectralFlatness * 10, color: '#f0ffc3' }, 
    { name: 'Sharpness', val: audioData.perceptualSharpness * 2, color: '#9ccfff' }, 
    { name: 'Energy', val: audioData.energy * 2, color: '#00f7ff' }, 
    { name: 'Spread', val: audioData.spectralSpread / 100, color: '#685aff' } 
  ];

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start', // Alinea todo al techo del contenedor
      gap: '12px', 
      padding: '25px', 
      borderRadius: '15px',
      justifyContent: 'center',
      minHeight: '320px' 
    }}>
      {features.map((f, i) => (
        <div key={i} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'flex-start', // Empuja contenido hacia abajo desde el tope
          height: '100%' 
        }}>
          {/* ETIQUETA ARRIBA */}
          <span style={{ 
            color: 'white', 
            fontSize: '10px', 
            fontFamily: 'monospace',
            textAlign: 'center',
            marginBottom: '5px', // Espacio antes de la barra
            opacity: 0.6
          }}>
            <span style={{color: f.color}}>{f.val.toFixed(1)}</span><br/>
            {f.name}
          </span>

          {/* LA BARRA QUE BAJA */}
          <div style={{
            width: '24px',
            height: '40px', 
            backgroundColor: f.color,
            borderRadius: '0 0 2px 2px', // Bordes redondeados abajo
            
            // --- TRANSFORMACIÓN INVERTIDA ---
            transformOrigin: 'top', // La base ahora es la parte superior
            transform: `scaleY(${1 + Math.min(f.val, 5)})`, // Crece hacia abajo
            
            boxShadow: `0 0 ${Math.min(f.val * 20, 40)}px ${f.color}`,
            transition: 'transform 0.05s ease-out',
          }} />
        </div>
      ))}
    </div>
  );
};