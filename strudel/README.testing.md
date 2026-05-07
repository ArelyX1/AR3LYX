# Strudel (AR3LYX) - Guía para el Equipo de Testing

## Inicio Rápido en Local

### Pre-requisitos
- Node.js >= 18.0.0
- pnpm (recomendado) o npm

### Pasos para iniciar

```bash
# 1. Instalar dependencias (monorepo)
pnpm install

# 2. Generar documentación JSON (requerido antes de test/build)
pnpm run jsdoc-json

# 3. Iniciar la página principal (REPL)
pnpm run dev
# Esto ejecuta: cd website && npm run dev
# El REPL estará disponible en: http://localhost:3000 (o el puerto que indique)
```

### Otros comandos útiles
```bash
# Build de producción
pnpm run build

# Preview del build
pnpm run preview

# Solo instalar dependencias
pnpm i
```

---

## Página Principal - Archivos Importantes

### Componente Principal del REPL
`website/src/repl/Repl.jsx` - **El corazón de la aplicación**

**Imports principales:**
- React Three Fiber: `Canvas`, `useThree` (3D)
- React Three Drei: `OrbitControls`, `useGLTF`, `Html` (helpers 3D)
- Three.js: `THREE` (motor 3D)
- Strudel packages: `@strudel/core`, `@strudel/webaudio`, etc.

**Estado y Contexto:**
- `website/src/repl/useReplContext.jsx` - Maneja estado global (patrón actual, play/pause, configuraciones)
- `website/src/settings.mjs` - Configuraciones persistentes (nanostores)

**Componentes hijos directos:**
- `ReplEditor.jsx` - Editor de código con syntax highlighting
- `EmbeddedReplEditor.jsx` - Versión embebida del editor
- Panel de configuración con tabs (Sounds, Patterns, Settings, Console, Files, Export)

### Three.js / Visualización 3D
Ubicados en `website/src/repl/three/`:

**Vistas:**
- `views/BkCubeBox.tsx` - Cajas 3D de fondo con shaders personalizados

**Componentes:**
- `components/CubesBox.tsx` - Cubos animados con materiales shader
- `components/TDStream.tsx` - Visualización de stream de datos
- `components/ShikinamiAnimation.tsx` - Animación de modelo 3D (GLTF)
- `components/AudioVisualizer.tsx` - Visualizador de audio en 3D
- `components/TopMarquee.tsx` - Marquesina superior

**Hooks personalizados:**
- `hooks/useBoxControls.tsx` - Controles para rotación/escala de cajas
- `hooks/useTDStream.tsx` - Lógica de stream 3D
- `hooks/useMeyda.ts` - Análisis de audio con Meyda (FFT, waveform)

### Patrones y Datos
- `website/src/repl/tunes.mjs` - **Patrones de ejemplo** (usados en tests)
- `website/src/repl/drum_patterns.mjs` - Patrones de batería predefinidos
- `website/src/repl/drawings.mjs` - Configuraciones de dibujo
- `website/src/repl/piano.mjs` - Mapeo de teclado/piano

### Estilos
- `website/src/repl/Repl.css` - Estilos específicos del REPL
- `website/src/styles/index.css` - Estilos globales
- `website/tailwind.config.cjs` - Configuración Tailwind


---

## Testing - Qué testear y cómo

### Framework: Vitest
Configuración: `vitest.config.mjs`

### Tests Actuales (sin navegador)
```bash
# Ejecutar todos los tests
pnpm run test

# Tests con UI
pnpm run test-ui

# Tests con cobertura
pnpm run test-coverage

# Actualizar snapshots
pnpm run snapshot
```

### Qué SE PUEDE testear ✅
- **Lógica de patrones**: `packages/core/` - eventos, ciclos, transformaciones
- **Transpilador**: `packages/transpiler/` - convierte strings a patrones
- **Mini notación**: `packages/mini/` - parsing de sintaxis
- **Teoría musical**: `packages/tonal/` - notas, intervalos, escalas
- **Snapshots**: Salida esperada de patrones musicales

### Qué NO SE PUEDE testear con Vitest ❌
- **Three.js / React Three Fiber**: Requiere contexto WebGL (navegador)
- **Web Audio API**: Requiere `AudioContext` del navegador
- **AudioWorklets**: Scripts que corren en hilos separados del navegador
- **Interacción UI**: Clicks, teclado, cambios de estado visual

Para estos últimos, se necesitaría:
- Playwright o Puppeteer (headless browser)
- Mocks de WebGL y Web Audio API
- Entorno de integración continua configurado

---

## Dependencias Clave

### Website (`website/package.json`)
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@react-three/fiber": "^9.5.0",
    "@react-three/drei": "^10.7.7",
    "three": "^0.182.0",
    "@strudel/core": "workspace:*",
    "@strudel/webaudio": "workspace:*",
    // ... más paquetes @strudel/*
  }
}
```

### Root (`package.json`)
```json
{
  "scripts": {
    "test": "vitest run",
    "dev": "cd website && npm run dev",
    "build": "cd website && npm run build"
  },
  "devDependencies": {
    "vitest": "^3.0.4",
    "@vitest/coverage-v8": "3.0.4"
  }
}
```

---

## Resumen para Testers

### Flujo de la aplicación:
1. Usuario entra a `website/src/pages/index.astro`
2. Se carga `Repl.jsx` como componente React cliente
3. `Repl.jsx` inicializa:
   - Editor de código (CodeMirror)
   - Motor de audio (Web Audio API / @strudel/webaudio)
   - Visualización 3D (Canvas de React Three Fiber)
   - Estado global (useReplContext)
4. Usuario escribe patrones en mini notación
5. Transpilador convierte código a patrones
6. Motor de audio genera sonido
7. Visualizador 3D reacciona al audio (useMeyda)

### Qué testear:
- ✅ Lógica pura: `pnpm run test`
- ❌ Interfaz completa: Requiere Playwright (no configurado)

### Archivos clave para entender:
1. `website/src/repl/Repl.jsx` - Componente principal
2. `website/src/repl/useReplContext.jsx` - Estado
3. `website/src/repl/tunes.mjs` - Patrones de ejemplo
4. `packages/core/` - Lógica de patrones
5. `packages/webaudio/` - Sonido

---

**Creado para el equipo de testing - Abril 2026**
**Versión Strudel**: 0.6.0 (website), 0.5.0 (monorepo)
**Comando inicio**: `pnpm install && pnpm run dev`
