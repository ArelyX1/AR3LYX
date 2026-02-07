import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'

export function useTDStream(url: string) {
  const { scene } = useThree()
  const textureRef = useRef<THREE.Texture>(new THREE.Texture())
  const urlRef = useRef<string | null>(null)

  useEffect(() => {
    console.log(`🔌 Intentando conectar al WebSocket: ${url}...`)
    const socket = new WebSocket(url)
    socket.binaryType = 'arraybuffer'

    socket.onmessage = (event: MessageEvent) => {
      const blob = new Blob([event.data], { type: 'image/jpeg' })
      const newUrl = URL.createObjectURL(blob)

      // Crear una imagen para actualizar la textura
      const img = new Image()
      img.onload = () => {
        textureRef.current.image = img
        textureRef.current.needsUpdate = true
        // Asignar al fondo de la escena solo la primera vez o mantenerlo
        scene.background = textureRef.current
      }
      img.src = newUrl

      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
      urlRef.current = newUrl
    }

    return () => {
      socket.close()
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [url, scene])

  return textureRef.current
}