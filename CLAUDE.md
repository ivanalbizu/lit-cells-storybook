# Lit + Cells + Storybook — Banking UI Kit

## Visión del proyecto
UI kit de componentes bancarios construido con Lit, documentado en Storybook,
e integrado en una SPA con Open Cells. Los componentes son atómicos, independientes
del framework de routing y reutilizables en cualquier contexto.

---

## Stack
- **Gestor de paquetes**: pnpm
- **Build**: Vite
- **Componentes**: Lit 3
- **Documentación**: Storybook 8 (con `@storybook/web-components-vite`)
- **SPA / Routing**: Open Cells (`@open-cells/core` + `@open-cells/page-controller`)
- **Lenguaje**: TypeScript

---

## Estructura del proyecto
```
src/
  components/         # Componentes Lit puros — sin dependencias de Cells
    atoms/
      bk-button/
        bk-button.ts
        bk-button.stories.ts
      bk-input/
      bk-badge/
      bk-amount/      # Formatea importes con divisa
      bk-avatar/
      bk-spinner/
      bk-chip/
    molecules/
      bk-card/
      bk-account-card/   # Tarjeta de cuenta: alias, saldo, IBAN
      bk-transaction-item/  # Fila de movimiento: concepto, fecha, importe
      bk-form-field/     # label + input + mensaje de error
      bk-alert/          # Notificación: info / success / warning / error
    organisms/
      bk-transaction-list/  # Lista de movimientos con filtros
      bk-account-summary/   # Resumen de cuenta con saldo y acciones
      bk-transfer-form/     # Formulario de transferencia con validación
      bk-header/            # Cabecera persistente con navegación
  pages/              # Páginas Open Cells — usan componentes de src/components
    home-page/
    accounts-page/
    account-detail-page/
    transfer-page/
    login-page/
  router/
    routes.ts
    app-index.ts      # startApp() + import de bk-header
  css/
    global.css
    tokens.css        # CSS custom properties: colores, tipografía, espaciados
  mocks/
    accounts.ts       # Datos de prueba para Storybook y desarrollo
    transactions.ts
```

---

## Diseño de componentes — reglas

### Los componentes en `src/components/` son Lit puro
- No importan nada de `@open-cells/*`
- No saben que existe un router
- Reciben datos por propiedades (`@property`) y emiten eventos (`CustomEvent`)
- Son testeables y documentables en Storybook de forma aislada

### Las páginas en `src/pages/` conocen Open Cells
- Instancian `PageController`
- Implementan `onPageEnter` / `onPageLeave`
- Navegan con `this.pageController.navigate(routeName)`
- Componen los organismos de `src/components/`

### CSS tokens
Toda la temática bancaria vive en `tokens.css` como custom properties:
```css
:root {
  --bk-color-primary: #003087;
  --bk-color-success: #007a3d;
  --bk-color-danger:  #c0392b;
  --bk-color-surface: #f4f6f9;
  --bk-radius-card:   12px;
  --bk-shadow-card:   0 2px 8px rgba(0,0,0,0.08);
  --bk-font-mono:     'Roboto Mono', monospace; /* importes */
}
```

---

## Catálogo de componentes

### Átomos
| Componente | Descripción |
|---|---|
| `bk-button` | Variantes: primary, secondary, ghost, danger. Tamaños: sm, md, lg |
| `bk-input` | Tipos: text, number, password, email. Con validación y mensaje de error |
| `bk-badge` | Etiqueta de estado: pending, completed, failed |
| `bk-amount` | Importe formateado con divisa y color según positivo/negativo |
| `bk-avatar` | Iniciales o imagen. Tamaños: sm, md, lg |
| `bk-spinner` | Indicador de carga |
| `bk-chip` | Filtro seleccionable (categorías de movimientos) |

### Moléculas
| Componente | Descripción |
|---|---|
| `bk-card` | Contenedor base con sombra y radio |
| `bk-account-card` | Alias de cuenta, saldo con `bk-amount`, últimos 4 dígitos |
| `bk-transaction-item` | Concepto, fecha, categoría (`bk-chip`), importe (`bk-amount`) |
| `bk-form-field` | `bk-input` + label + mensaje de error accesible |
| `bk-alert` | Mensaje con icono: info / success / warning / error |

### Organismos
| Componente | Descripción |
|---|---|
| `bk-transaction-list` | Lista de `bk-transaction-item` con filtro por `bk-chip` |
| `bk-account-summary` | `bk-account-card` + botones de acción (transferir, extraer) |
| `bk-transfer-form` | Formulario con `bk-form-field`: IBAN destino, importe, concepto |
| `bk-header` | Logo + navegación. Componente persistente fuera del router |

### Páginas Open Cells
| Página | Ruta | Descripción |
|---|---|---|
| `home-page` | `#/home` | Dashboard: resumen de cuentas + últimos movimientos |
| `accounts-page` | `#/accounts` | Lista de cuentas con `bk-account-card` |
| `account-detail-page` | `#/account/:id` | Detalle con `bk-account-summary` + `bk-transaction-list` |
| `transfer-page` | `#/transfer` | `bk-transfer-form` completo |
| `login-page` | `#/login` | Acceso — ruta pública, sin interceptor |

---

## Storybook — convenciones

### Archivo de story
Cada componente tiene su `*.stories.ts` junto al componente:
```ts
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-button.js';

const meta: Meta = {
  title: 'Atoms/BkButton',
  component: 'bk-button',
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;

export const Primary: StoryObj = {
  args: { variant: 'primary', label: 'Transferir' },
  render: ({ variant, label, disabled }) =>
    html`<bk-button variant=${variant} ?disabled=${disabled}>${label}</bk-button>`,
};
```

### Stories obligatorias por componente
- `Default` — estado base
- Una por variante/estado relevante
- `WithError` para inputs y formularios
- `Loading` para componentes con estado async

---

## Open Cells — gotchas conocidos

- **CSS obligatorio** para ocultar páginas inactivas:
  ```css
  #app-content > [state="cached"],
  #app-content > [state="inactive"] { display: none; }
  ```
- **Redirect del interceptor**: objeto `{ page: 'login' }`, no string.
- **`skipNavigations`**: cada entrada es `{ from?: string, to?: string }`.
- **Componentes persistentes** (como `bk-header`): fuera del `#app-content`,
  usan `navigate` de `@open-cells/core` directamente.
- **`viewLimit`**: por defecto 3. `persistentPages` excluye páginas del conteo.

---

## Convenciones de código

- Nombres de custom elements con prefijo `bk-` (banking)
- Propiedades públicas con `@property()`, estado interno con `@state()`
- Eventos con nombre `bk-[componente]-[acción]`: ej. `bk-transfer-submit`
- Estilos dentro del componente con `static styles = css\`...\``; tokens vía custom properties
- Snippets de código siempre con la clase cerrada (`}`) aunque continúe en otro slide
