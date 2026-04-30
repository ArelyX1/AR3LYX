# strudel

Live coding patterns on the web


- Try it here: <https://strudel.cc>
- Docs: <https://strudel.cc/learn>
- Source: https://codeberg.org/uzu/strudel/
  * Along with many other live coding projects, we have moved from Microsoft's Github platform to Codeberg for ethical reasons. **Please don't fork the project back to github**.
- Technical Blog Post: <https://loophole-letters.vercel.app/strudel>
- 1 Year of Strudel Blog Post: <https://loophole-letters.vercel.app/strudel1year>
- 2 Years of Strudel Blog Post: <https://strudel.cc/blog/#year-2>


## Running Locally

After cloning the project, you can run the REPL locally:

1. Install [Node.js](https://nodejs.org/) 18 or newer
2. Install [pnpm](https://pnpm.io/installation)
3. Install dependencies by running the following command:
   ```bash
   pnpm i
   ```
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Using Strudel In Your Project

This project is organized into many [packages](./packages), which are also available on [npm](https://www.npmjs.com/search?q=%40strudel).

Read more about how to use these in your own project [here](https://strudel.cc/technical-manual/project-start).

You will need to abide by the terms of the [GNU Affero Public Licence v3](LICENSE). As such, Strudel code can only be shared within free/open source projects under the same license -- see the license for details.

Licensing info for the default sound banks can be found over on the [dough-samples](https://github.com/felixroos/dough-samples/blob/main/README.md) repository.

## Para Testers (Frontend)

Si vas a probar la interfaz visual (página principal, editor, layout), aquí tienes lo básico:

### Estructura de archivos que te interesan
- **Astro** (página principal): `website/src/pages/` y `website/src/layouts/`
- **React / JSX** (editor REPL): `packages/repl/` y `packages/codemirror/`
- **Componentes**: `website/src/components/` contiene componentes en `.jsx`, `.tsx`, `.js`, `.ts`

### Cómo ejecutar para probar manualmente
```bash
pnpm i   # instalar dependencias
pnpm dev # abre la página en http://localhost:3000
```

### Qué probar (básico)
- **Layout de la página principal**: que se vea bien, botones funcionen, navegación
- **Editor (REPL)**: escribir código, ejecutar (Ctrl+Enter), que suene
- **Interfaz en general**: menús, botones de play/stop, cambios de tema

### Sobre los archivos de prueba (tests)
Los tests automáticos están en `packages/*/test/` y usan Vitest. Aunque muchos archivos tienen extensión `.mjs`, tú puedes escribir tests en formatos que ya conoces:
- `.test.js` o `.spec.js`
- `.test.jsx` o `.spec.jsx`
- `.test.tsx` o `.spec.tsx`

Para correr todos los tests automáticos:
```bash
pnpm test
```

### Comandos útiles
```bash
pnpm lint   # revisa errores de código
pnpm check  # formato + lint + tests
```

## Contributing

There are many ways to contribute to this project! See [contribution guide](./CONTRIBUTING.md). You can find the full list of contributors [here](https://codeberg.org/uzu/strudel/activity/contributors).

## Community

There is a #strudel channel on the TidalCycles discord: <https://discord.com/invite/HGEdXmRkzT>

You can also ask questions and find related discussions on the tidal club forum: <https://club.tidalcycles.org/>

The discord and forum is shared with the haskell (tidal) and python (vortex) siblings of this project.

We also have a mastodon account: <a rel="me" href="https://social.toplap.org/@strudel">social.toplap.org/@strudel</a>
