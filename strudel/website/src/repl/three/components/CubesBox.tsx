import * as THREE from 'three'
import { useRef, useMemo, useLayoutEffect, useEffect } from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { shaderMaterial, useProgress, Html, OrbitControls } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import niceColors from 'nice-color-palettes'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { useTDStream } from '../hooks/useTDStream'


interface BoxesProps {
  length: number
  size: [number, number, number]
  separation: number
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshEdgesMaterial: any
  }
}

function SceneContent({ length, size, separation }: BoxesProps) {
  // Conectamos al puente de Node.js
  useTDStream('ws://192.168.1.9:5401')

  return (
    <>
      <Boxes length={length} size={size} separation={separation} />
      {/* Luz para que los cubos se vean sobre el fondo */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  )
}

const MeshEdgesMaterial = shaderMaterial(
  {
    color: new THREE.Color('white'),
    size: new THREE.Vector3(15, 15, 15),
    thickness: 1.01,
    smoothness: 0.2
  },
  `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4(position, 1.0);
    }
  `,
  `
    varying vec3 vPosition;
    uniform vec3 size;
    uniform vec3 color;
    uniform float thickness;
    uniform float smoothness;
    void main() {
      vec3 d = abs(vPosition) - (size * 0.5);
      float a = smoothstep(thickness, thickness + smoothness, min(min(length(d.xy), length(d.yz)), length(d.xz)));
      gl_FragColor = vec4(color, 1.0 - a);
    }
  `
)

extend({ MeshEdgesMaterial })

const o = new THREE.Object3D()

// ... (Todo tu inicio, MeshEdgesMaterial y Object3D 'o' se quedan IGUAL)

function Boxes({ length, size, separation, ...props }: BoxesProps) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const outlines = useRef<THREE.InstancedMesh>(null)

  // 1. Cargamos el modelo (Mismo path)
  const GLTF = useLoader(GLTFLoader, '/src/fiver/poteto.glb')

  const findMesh = (obj: THREE.Object3D): THREE.Mesh | null => {
    if ((obj as THREE.Mesh).geometry) return obj as THREE.Mesh
    for (const child of obj.children) {
      const found = findMesh(child)
      if (found) return found
    }
    return null
  }

  const tetoModel = findMesh(GLTF.scene)
  if (!tetoModel || !tetoModel.geometry) return null

  // 2. Mantenemos tu clonado y materiales
  const geom = useMemo(() => tetoModel.geometry.clone().scale(size[0], size[1], size[2]), [tetoModel, size])
  const originalMaterial = tetoModel.material as THREE.Material
  
  const material = useMemo(() => {
    if (originalMaterial instanceof THREE.MeshStandardMaterial) return originalMaterial
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.1 })
    if ((originalMaterial as any).map) mat.map = (originalMaterial as any).map
    return mat
  }, [originalMaterial])

  const colors = useMemo(() => {
    const arr = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      const color = niceColors[9][Math.floor(Math.random() * 5)]
      const c = new THREE.Color(color)
      arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b
    }
    return arr
  }, [length])

  // FIX: Esta función asegura que las matrices se llenen SIEMPRE
  useLayoutEffect(() => {
    if (!ref.current || !outlines.current) return
    
    let id = 0
    const root = Math.round(Math.pow(length, 1 / 3))
    const halfRoot = root / 2
    const offset = (halfRoot * separation) / 2
    const jitter = separation * 0.8

    for (let x = 0; x < root; x++) {
      for (let y = 0; y < root; y++) {
        for (let z = 0; z < root; z++) {
          if (id >= length) break // Seguridad
          o.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)
          o.position.set(
            (halfRoot - x) * separation - offset + Math.random()*jitter,
            (halfRoot - y) * separation - offset + Math.random()*jitter,
            (halfRoot - z) * separation - offset + Math.random()*jitter
          )
          o.updateMatrix()
          ref.current.setMatrixAt(id, o.matrix)
          outlines.current.setMatrixAt(id, o.matrix)
          id++
        }
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
    outlines.current.instanceMatrix.needsUpdate = true
  }, [length, separation, geom]) // Añadimos 'geom' como dependencia para que re-calcule al actualizar

  return (
    <group {...props}>
      {/* Tus luces exactas */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 50]} intensity={2} />
      <directionalLight position={[-10, -10, -50]} intensity={2} />
      <pointLight position={[0, 15, 0]} intensity={2} distance={80} />
      <pointLight position={[20, 0, 20]} intensity={1.5} distance={60} />
      <pointLight position={[-20, 0, -20]} intensity={1.5} distance={60} />
      <pointLight position={[0, -10, 0]} intensity={1} distance={50} />

      {/* 3. CLAVE: Usamos 'key' para que React no intente reciclar el buffer viejo de Strudel */}
      <instancedMesh key={`teto-main-${length}`} ref={ref} args={[geom, material, length]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </instancedMesh>

      <instancedMesh key={`teto-out-${length}`} ref={outlines} args={[geom, null as any, length]}>
        <meshEdgesMaterial
          transparent
          polygonOffset
          polygonOffsetFactor={-10}
          size={size}
          color="black"
          thickness={0.001}
          smoothness={0.005}
        />
      </instancedMesh>
    </group>
  )
}
// ... (CubesBox se queda igual)

export function CubesBox({ length, size, separation }: BoxesProps) {
  const controlsRef = useRef<any>(null)
  const target = useRef(new THREE.Vector3(0, 0, 0))
  
  useEffect(() => {
    let timeout: any = null
    const handleMove = (e: MouseEvent) => {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true
        const mx = (e.clientX / window.innerWidth - 0.5) * 15
        const my = (e.clientY / window.innerHeight - 0.5) * 10
        target.current.set(mx*-1, my*-1, (mx + my) / 10)
        controlsRef.current.target.copy(target.current)
        controlsRef.current.update()
      }
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (controlsRef.current) controlsRef.current.autoRotate = true
      }, 800)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <Canvas camera={{ position: [5, -5, 10], fov: 50 }}>
      <SceneContent length={length} size={size} separation={separation} />
      <Boxes length={length} size={size} separation={separation} />

      <OrbitControls
        ref={controlsRef}
        target={[0, 0, 0]}
        autoRotate={true}
        autoRotateSpeed={1.5}
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
      />
    </Canvas>
  )
}