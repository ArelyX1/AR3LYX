import React, { useEffect, useRef, useState } from 'react';

export const TDStream: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const urlRef = useRef<string | null>(null);
    const frameCount = useRef<number>(0); // Contador para no saturar la consola

    useEffect(() => {
        console.log("🔌 Intentando conectar al WebSocket: ws://192.168.1.9:5401...");
        const socket = new WebSocket('ws://192.168.1.9:5401');
        
        socket.binaryType = 'arraybuffer'; 

        // Log de conexión exitosa
        socket.onopen = () => {
            console.log("✅ WebSocket Conectado exitosamente");
        };

        socket.onmessage = (event: MessageEvent) => {
            // Log cada 100 frames para confirmar que sigue vivo sin inundar la consola
            frameCount.current++;
            if (frameCount.current % 100 === 0) {
                console.log(`📸 Recibidos ${frameCount.current} frames. Tamaño del último: ${(event.data.byteLength / 1024).toFixed(2)} KB`);
            }

            const blob = new Blob([event.data], { type: 'image/jpeg' });
            const newUrl = URL.createObjectURL(blob);

            setImageSrc(newUrl);

            if (urlRef.current) {
                URL.revokeObjectURL(urlRef.current);
            }
            urlRef.current = newUrl;
        };

        socket.onerror = (error) => {
            console.error('❌ Error detectado en WebSocket:', error);
        };

        socket.onclose = (event) => {
            if (event.wasClean) {
                console.log(`ℹ️ Conexión cerrada limpiamente (código: ${event.code})`);
            } else {
                console.warn('⚠️ Conexión perdida abruptamente (posible caída del servidor o red)');
            }
        };

        return () => {
            console.log("🧹 Limpiando componente y cerrando socket...");
            socket.close();
            if (urlRef.current) {
                URL.revokeObjectURL(urlRef.current);
            }
        };
    }, []);

    return (
        <div style={{ background: '#00000000', width: '100%', display: 'flex', justifyContent: 'center', minHeight: '300px' }}>
            {imageSrc ? (
                <img 
                    src={imageSrc} 
                    alt="TD Stream" 
                    style={{ maxWidth: '1280px', width: '100%', objectFit: 'contain' }} 
                />
            ) : (
                <p style={{ color: '#fff', alignSelf: 'center' }}>Esperando señal de TouchDesigner...</p>
            )}
        </div>
    );
};
