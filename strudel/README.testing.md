# Strudel (AR3LYX) - Guía para el Equipo de Testing

## Página Principal

**Entrada**: `website/src/pages/index.astro`
- Carga el componente React: `<Repl client:only="react" />`
- Inicializa con: `website/src/pages/init.js`

**Componente Principal**: `website/src/repl/Repl.jsx`
- Integra editor de código, motor de audio y visualización 3D
- Usa React Three Fiber para gráficos 3D
- Usa Web Audio API para sonido

---

## Archivos Clave para Testing

### REPL (Núcleo)
```
website/src/repl/
├── Repl.jsx                    # COMPONENTE PRINCIPAL
├── Repl.css                    # Estilos
├── useReplContext.jsx           # Estado global del REPL
├── ReplEditor.jsx               # Editor de código
├── EmbeddedReplEditor.jsx       # Editor embebido
├── tunes.mjs                    # Patrones de ejemplo
├── drum_patterns.mjs            # Patrones de batería
└── components/
    ├── Panel.jsx                # Panel de configuración
    ├── Code.jsx                 # Componente de código
    ├── BigPlayButton.jsx        # Botón play
    └── panel/
        ├── WelcomeTab.jsx       # Pestaña bienvenida
        ├── SoundsTab.jsx        # Pestaña sonidos
        ├── SettingsTab.jsx      # Pestaña configuración
        └── ConsoleTab.jsx       # Pestaña consola
```

### Three.js / 3D (React Three Fiber)
```
website/src/repl/three/
├── views/
│   └── BkCubeBox.tsx           # Cajas 3D fondo
├── components/
│   ├── CubesBox.tsx            # Cubos animados
│   ├── TDStream.tsx            # Stream de datos 3D
│   ├── ShikinamiAnimation.tsx  # Animaciones
│   └── AudioVisualizer.tsx     # Visualizador audio 3D
└── hooks/
    ├── useBoxControls.tsx       # Controles 3D
    ├── useTDStream.tsx          # Hook stream 3D
    └── useMeyda.ts             # Análisis audio (Meyda)
```

### Paquetes de Sonido (Monorepo)
```
packages/
├── core/                       # Lógica de patrones
├── webaudio/                    # Web Audio API
├── mini/                        # Mini notación
├── tonal/                       # Teoría musical
├── transpiler/                  # Transpilador
├── hydra/                       # Visuales
└── midi/                        # Soporte MIDI
```

---

## Configuración de Testing

### Framework: Vitest
**Archivo config**: `vitest.config.mjs`

### Tests Actuales
```
test/
├── tunes.test.mjs               # Snapshots de patrones
├── examples.test.mjs            # Snapshots de ejemplos
└── runtime.mjs                  # Utilidades ejecución
```

### Comandos
```bash
# Instalar dependencias
pnpm install

# Ejecutar tests
pnpm run test

# Actualizar snapshots
pnpm run snapshot
```

---

## ¿Qué se puede testear?

### ✅ SÍ se puede (Vitest - sin navegador)
- Lógica de patrones musicales
- Transpilador de código
- Funciones de los paquetes `packages/*`
- Snapshots de salida de patrones

### ❌ NO se puede (requiere navegador)
- Componentes Three.js (WebGL)
- Web Audio API (AudioWorklets)
- Interacción del REPL (React components)
- Estos requieren Playwright/Puppeteer

---

## Dependencias Clave (package.json)

**Website** (`website/package.json`):
- `react`, `react-dom` - UI
- `@react-three/fiber`, `@react-three/drei` - 3D
- `three` - Motor 3D
- `@strudel/*` - Paquetes del monorepo

**Root** (`package.json`):
- `vitest` - Testing
- `pnpm` - Package manager

---

## Resumen para Testers

1. **Página principal**: `website/src/pages/index.astro` → carga `website/src/repl/Repl.jsx`
2. **Tests actuales**: `pnpm run test` (funciona sin navegador)
3. **Patrones**: Definidos en `website/src/repl/tunes.mjs`
4. **3D/Audio**: En `website/src/repl/three/` (requiere navegador para testear)
5. **Paquetes**: Lógica en `packages/*/`

**Nota**: Los tests de Vitest solo cubren lógica de patrones. Para testing E2E del REPL completo, se necesitaría configurar Playwright.
