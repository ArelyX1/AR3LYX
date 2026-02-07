import { useControls, button } from 'leva'

interface AudioState {
  isActive: boolean;
  start: () => void;
  stop: () => void;
}

export function useBoxControls(audioState?: AudioState) {
  return useControls({
    ...(audioState && {
      'System Audio': button(() => {
        audioState.isActive ? audioState.stop() : audioState.start()
      })
    }),
    bpm: {
      value: 120,
      step: 1,
      min: 15,
      max: 500,
      label: 'BPM',
    },
    length: { value: 50, min: 0, max: 160, step: 5, label: 'Boxes count' },
    size: {
      label: 'Cube size',
      value: [0.45, 0.45, 0.45],
      min: 0.01, max: 2, step: 0.01
    },
    separation: { value: 10, min: 0.1, max: 20, step: 0.1, label: 'Cube separation' },
  }, [audioState?.isActive])
}