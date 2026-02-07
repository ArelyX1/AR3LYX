import { useState, useRef, useEffect, useCallback } from 'react';
import Meyda from 'meyda';
import { MeydaAnalyzer } from 'meyda/dist/esm/meyda-wa';

export const useMeyda = () => {
  const [audioData, setAudioData] = useState<any>(null);
  const [volume, setVolume] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  
  const analyzerRef = useRef<MeydaAnalyzer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: true
      });
      
      streamRef.current = stream;
      const audioTrack = stream.getAudioTracks()[0];
      
      if (!audioTrack) {
        alert("¡Error! Debes marcar la casilla 'Compartir audio del sistema'");
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      const audioStream = new MediaStream([audioTrack]);
      const context = new AudioContext();
      audioContextRef.current = context;
      const source = context.createMediaStreamSource(audioStream);

      analyzerRef.current = Meyda.createMeydaAnalyzer({
        audioContext: context,
        source: source,
        bufferSize: 512,
        featureExtractors: [
        'rms', 
        'zcr', 
        'spectralCentroid', 
        'spectralRolloff', 
        'spectralFlatness', 
        'perceptualSharpness', 
        'energy', 
        'spectralSpread'
        ],
        callback: (features) => {
          setVolume(features.rms);
          setAudioData(features);
        },
      });

      analyzerRef.current.start();
      setIsActive(true);
    } catch (err) {
      console.error("Error capturando audio:", err);
    }
  }, []);

  const stop = useCallback(() => {
    analyzerRef.current?.stop();
    audioContextRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setIsActive(false);
    setVolume(0);
    setAudioData(null);
  }, []);

  useEffect(() => {
    return () => {
      analyzerRef.current?.stop();
      audioContextRef.current?.close();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return { volume, audioData, isActive, start, stop };
};