# Strudel (AR3LYX) - Guía para el Equipo de Testing

## Inicio Local con pnpm

### Pre-requisitos
- Node.js >= 18.0.0
- pnpm (gestor de paquetes del proyecto)

### Pasos para iniciar el proyecto localmente

```bash
# 1. Instalar pnpm (si no lo tienes)
npm install -g pnpm

# 2. Clonar el repositorio e ingresar
git clone <url-del-repositorio>
cd strudel

# 3. Instalar todas las dependencias del monorepo
pnpm install

# 4. Generar documentación JSON (requerido antes de desarrollo/tests)
pnpm run jsdoc-json

# 5. Iniciar la página principal (REPL) en modo desarrollo
pnpm run dev
# Equivalente a: cd website && npm run dev
# El REPL estará disponible en: http://localhost:3000 (o puerto indicado en terminal)
```

### Comandos pnpm útiles
```bash
# Build de producción
pnpm run build

# Preview del build local
pnpm run preview

# Ejecutar tests (Vitest)
pnpm run test

# Actualizar snapshots de tests
pnpm run snapshot

# Benchmarks de rendimiento
pnpm run bench
```

---

## Página Principal - Archivos que la Conforman

La página principal es el REPL de Strudel. A continuación se detallan **todos los archivos críticos** que componen la página principal, desde la entrada hasta los componentes 3D y de audio.

### 1. Entrada del Sitio
| Archivo | Propósito |
|---------|-----------|
| `website/src/pages/index.astro` | **Página raíz** - Carga el HTML base y el componente React del REPL |
| `website/src/pages/init.js` | Script de inicialización que se ejecuta al cargar la página |

**Contenido clave de `index.astro`:**
```astro
---
import { Repl } from '../repl/Repl';
---
<html lang="en" class="m-0 dark">
  <body class="h-app-height bg-background m-0">
    <Repl client:only="react" />
  </body>
</html>
```

### 2. Componente Principal del REPL
`website/src/repl/Repl.jsx` - **Corazón de la aplicación**

**Imports principales:**
- React: `useState`, `useEffect`, `useRef`
- Three.js: `three`, `@react-three/fiber`, `@react-three/drei`
- Strudel: `@strudel/core`, `@strudel/webaudio`
- Componentes hijos: `ReplEditor`, `Panel`, componentes 3D

**Lo que renderiza:**
- Canvas 3D (React Three Fiber) con modelos y visualizadores
- Editor de código (CodeMirror)
- Panel lateral de configuración

### 3. Estado y Contexto
| Archivo | Propósito |
|---------|-----------|
| `website/src/repl/useReplContext.jsx` | Estado global del REPL (patrón actual, play/pause, configuraciones) |
| `website/src/settings.mjs` | Configuraciones persistentes usando nanostores |

### 4. Componentes del Editor y Panel
Todos en `website/src/repl/components/`:

| Archivo | Propósito |
|---------|-----------|
| `ReplEditor.jsx` | Editor de código principal con syntax highlighting |
| `EmbeddedReplEditor.jsx` | Versión embebida del editor para páginas internas |
| `Panel.jsx` | Panel lateral con pestañas (Sounds, Patterns, Settings, Console) |
| `BigPlayButton.jsx` | Botón de reproducción/pausa |
| `Code.jsx` | Visualización de código |
| `panel/SoundsTab.jsx` | Pestaña de selección de sonidos |
| `panel/SettingsTab.jsx` | Configuración de audio y REPL |
| `panel/ConsoleTab.jsx` | Consola de errores y logs |
| `panel/PatternsTab.jsx` | Gestión de patrones guardados |

### 5. Three.js / Visualización 3D
Todos en `website/src/repl/three/`:

| Archivo | Propósito |
|---------|-----------|
| `views/BkCubeBox.tsx` | Cajas 3D de fondo con shaders personalizados |
| `components/CubesBox.tsx` | Cubos animados que reaccionan al audio |
| `components/AudioVisualizer.tsx` | Visualizador de audio en tiempo real (3D) |
| `components/ShikinamiAnimation.tsx` | Animación de modelo 3D (GLTF) |
| `components/TDStream.tsx` | Stream de datos visuales |
| `hooks/useMeyda.ts` | Análisis de audio (FFT, waveform) con Meyda |
| `hooks/useBoxControls.tsx` | Controles de rotación/escala de objetos 3D |
| `hooks/useTDStream.tsx` | Lógica de stream de datos 3D |

### 6. Patrones y Datos
| Archivo | Propósito |
|---------|-----------|
| `website/src/repl/tunes.mjs` | **Patrones de ejemplo** (usados en tests y el REPL) |
| `website/src/repl/drum_patterns.mjs` | Patrones predefinidos de batería |
| `website/src/repl/drawings.mjs` | Configuraciones de dibujo visual |
| `website/src/repl/piano.mjs` | Mapeo de teclado virtual/piano |
| `website/src/repl/audiograph.mjs` | Grafo de conexiones de audio |

### 7. Estilos
| Archivo | Propósito |
|---------|-----------|
| `website/src/repl/Repl.css` | Estilos específicos del REPL |
| `website/src/styles/index.css` | Estilos globales |
| `website/tailwind.config.cjs` | Configuración de Tailwind CSS |
| `website/astro.config.mjs` | Configuración de Astro (React, MDX, PWA) |

### 8. Paquetes del Monorepo (Lógica de Sonido)
Estos paquetes en `packages/` proveen la funcionalidad de audio y procesamiento:

| Paquete | Ubicación | Propósito |
|---------|-----------|-----------|
| **core** | `packages/core/` | Lógica de patrones, eventos, Hap |
| **webaudio** | `packages/webaudio/` | Web Audio API, síntesis, AudioWorklets |
| **mini** | `packages/mini/` | Mini notación (sintaxis Tidal) |
| **transpiler** | `packages/transpiler/` | Transpila código a patrones |
| **tonal** | `packages/tonal/` | Teoría musical, notas, escalas |
| **hydra** | `packages/hydra/` | Visuales con Hydra |
| **midi** | `packages/midi/` | Soporte para dispositivos MIDI |

---

## Testing - Qué pueden testear

### Framework: Vitest
Configuración: `vitest.config.mjs`

### Comandos de test
```bash
# Ejecutar todos los tests (sin navegador)
pnpm run test

# Tests con interfaz gráfica
pnpm run test-ui

# Actualizar snapshots
pnpm run snapshot
```

### ✅ LO QUE SÍ SE PUEDE TESTEAR
- Lógica de patrones (`packages/core/`)
- Transpilador (`packages/transpiler/`)
- Mini notación (`packages/mini/`)
- Snapshots de salida de patrones (`test/tunes.test.mjs`)

### ❌ LO QUE NO SE PUEDE TESTEAR (requiere navegador)
- Componentes Three.js (WebGL)
- Web Audio API (AudioWorklets)
- Interacción del REPL (React components)
- Requiere Playwright/Puppeteer para E2E

---

## Resumen para Testers

1. **Inicio local**: `pnpm install && pnpm run dev`
2. **Página principal**: `website/src/pages/index.astro` → carga `website/src/repl/Repl.jsx`
3. **Archivos críticos**: Repl.jsx, useReplContext.jsx, componentes 3D en `three/`, patrones en `tunes.mjs`
4. **Tests**: `pnpm run test` (solo lógica, no interfaz completa)

---

**Creado para el equipo de testing - Abril 2026**
**Versión Strudel**: 0.6.0 (website), 0.5.0 (monorepo)
**Comando clave**: `pnpm run dev`
