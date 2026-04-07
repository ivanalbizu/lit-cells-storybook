# Estrategia de estilos en Web Components con Lit

Investigación sobre tendencias de la industria (2024–2025) aplicada a este proyecto.

---

## Conclusión directa

El enfoque de este proyecto — **CSS plano dentro de `static styles = css\`...\`` con CSS custom properties** — es el estándar de la industria en 2025. No hay razón para introducir SASS/SCSS en la capa de componentes.

---

## Qué usan los grandes design systems

| Empresa / Proyecto | Enfoque | Notas |
|---|---|---|
| **Google — Material Web** | SCSS en autoría, compilado a CSS antes de distribuir | El consumidor nunca ve SCSS. ~62% del código fuente es SCSS, pero el output son `.css.ts` con CSS plano |
| **Adobe — Spectrum Web Components** | PostCSS + CSS custom properties | Sin SCSS en componentes. Archivos `.css` procesados por PostCSS, exportados como `CSSResult` |
| **Salesforce — LWC** | CSS plano + tokens `--slds-*` | Shadow DOM como encapsulación nativa. Sin preprocesadores |
| **ING — Lion** | CSS plano dentro de `static styles` | White-label: sin opiniones visuales. Tematización 100% por custom properties |
| **Shoelace / Web Awesome** | CSS plano + `::part()` + custom properties | Rechazaron SCSS explícitamente para permitir consumo desde CDN sin build pipeline |
| **Microsoft — Fluent UI Web Components** | Tokens algorítmicos + CSS custom properties | Sin SCSS. Estilos generados en runtime desde design tokens |
| **Vaadin — Web Components** | CSS + `ThemableMixin` | SCSS disponible para overrides a nivel de app, no recomendado en internos de componente |
| **BBVA — Open Cells** | CSS plano en `static styles` con Lit | El mismo patrón de este proyecto |

---

## Por qué SCSS no encaja bien en Web Components

### 1. Las variables SCSS son compile-time, los custom properties son runtime

```scss
/* SCSS — solo existe durante la compilación */
$color-primary: #003087;
.btn { background: $color-primary; }
```

```css
/* CSS custom property — atraviesa el Shadow DOM en tiempo de ejecución */
:root { --bk-color-primary: #003087; }
.btn { background: var(--bk-color-primary); }
```

Para tematizar un Web Component desde fuera (cambiar colores por tenant, dark mode, etc.) solo funcionan las custom properties. Una variable SCSS compilada es inaccesible una vez que el componente está en el DOM.

### 2. El Shadow DOM ya es el sistema de encapsulación

SCSS/BEM nacieron para resolver la contaminación del scope CSS global en aplicaciones sin encapsulación. El Shadow DOM resuelve ese problema a nivel de plataforma. Un componente Lit con Shadow DOM no necesita convenciones de nomenclatura para evitar colisiones — los estilos están físicamente aislados.

### 3. Consumo sin build pipeline

Un Web Component puede cargarse desde CDN con un simple `<script type="module">`. Si los estilos dependen de SCSS, el consumidor necesita un build step. CSS plano con custom properties funciona desde CDN, en cualquier framework, o directamente en HTML.

### 4. CSS nesting nativo elimina el último argumento

El soporte de CSS nesting nativo es baseline estable desde 2024 (Chrome 112+, Firefox 117+, Safari 17.2+). El principal argumento para usar SCSS era el anidamiento. Ya no hace falta:

```ts
// Dentro de static styles = css`...` — sin instalar nada
static styles = css`
  .btn {
    background: var(--bk-color-primary);
    cursor: pointer;

    &:hover { background: var(--bk-color-primary-hover); }
    &:disabled { opacity: 0.45; cursor: not-allowed; }

    &.sm { padding: 0.375rem 0.875rem; font-size: 0.8125rem; }
    &.md { padding: 0.625rem 1.25rem;  font-size: 0.9375rem; }

    &.primary { color: var(--bk-color-text-inverse); }
    &.primary:hover:not(:disabled) { background: var(--bk-color-primary-hover); }
  }
`;
```

---

## Qué recomienda el equipo de Lit

De la documentación oficial:

> "The `static styles` class field is **almost always the best way** to add styles to your component" y "results in the most optimal performance."

La cadena de recomendación oficial es:

1. Escribir CSS dentro de `static styles = css\`...\`` — Shadow DOM lo encapsula automáticamente.
2. Usar **CSS custom properties** para todo lo que necesite tematización externa.
3. Exponer **`::part()`** para personalización estructural por parte del consumidor.

SASS, CSS Modules y CSS-in-JS no aparecen en la documentación principal de Lit.

---

## La única excepción: Google Material Web

Material Web usa SCSS extensamente en el código fuente (~62% del repositorio). Sin embargo, es **SCSS como herramienta de autoría interna**, no como interfaz pública:

- Los archivos `.scss` generan `.css.ts` con `CSSResult` de Lit.
- Los consumidores de Material Web importan CSS compilado, nunca SCSS.
- La tematización pública se hace exclusivamente con `--md-*` custom properties.

Esto confirma que incluso en el caso más pro-SCSS de la industria, el SCSS está **detrás del build**, invisible para el consumidor.

---

## Opciones si se quisiera añadir un preprocesador

Si en el futuro se necesitara SCSS (por ejemplo, para heredar un sistema de tokens existente en SCSS), la integración con Vite es:

```bash
pnpm add -D sass
```

```ts
// bk-button.scss → Vite lo compila
import styles from './bk-button.scss?inline';
import { unsafeCSS, LitElement } from 'lit';

export class BkButton extends LitElement {
  static styles = unsafeCSS(styles);
}
```

`?inline` devuelve el CSS compilado como string. `unsafeCSS` lo convierte al tipo `CSSResult` que Lit espera. El nombre `unsafe` advierte que el string no pasa por el sanitizador de Lit — seguro si el origen es un archivo propio, no si viene de input de usuario.

---

## Patrón actual del proyecto (referencia)

```ts
// tokens.css — custom properties globales
:root {
  --bk-color-primary: #003087;
  --bk-color-surface: #f4f6f9;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bk-color-primary: #4a7fcb;
    --bk-color-surface: #0f172a;
  }
}
```

```ts
// bk-button.ts — consume tokens con fallback
static styles = css`
  .btn {
    background: var(--bk-color-primary, #003087);
    color: var(--bk-color-text-inverse, #fff);
    border-radius: var(--bk-radius-md, 8px);
  }
`;
```

Este patrón permite:
- **Dark mode automático** — el componente no sabe que existe el modo oscuro, reacciona a los tokens.
- **Tematización por tenant** — basta con redefinir `--bk-color-primary` en un scope CSS.
- **Consumo en cualquier contexto** — el componente funciona sin el archivo `tokens.css` gracias a los fallbacks.

---

## Referencias

- [Lit — Styles documentation](https://lit.dev/docs/components/styles/)
- [material-components/material-web — GitHub](https://github.com/material-components/material-web)
- [adobe/spectrum-web-components — GitHub](https://github.com/adobe/spectrum-web-components)
- [ing-bank/lion — GitHub](https://github.com/ing-bank/lion)
- [shoelace-style/shoelace — GitHub](https://github.com/shoelace-style/shoelace)
- [BBVA/open-cells — GitHub](https://github.com/BBVA/open-cells)
- [The Modern 2025 Web Components Tech Stack — DEV Community](https://dev.to/matsuuu/the-modern-2025-web-components-tech-stack-1l00)
- [Modern CSS vs. Sass: Rethinking Preprocessors in 2025](https://jaystechbites.com/posts/2025/modern-css-vs-sass-2025/)
- [CSS nesting — MDN baseline](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
