# Lit + Open Cells + Storybook — Banking UI Kit

Guía completa de arquitectura, configuración y patrones aprendidos durante el desarrollo de este proyecto. Sirve como guion para montar este stack desde cero y como referencia de todos los conceptos del ecosistema.

---

## Índice

1. [Stack y versiones](#1-stack-y-versiones)
2. [Instalación y comandos](#2-instalación-y-comandos)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Ecosistema Lit](#4-ecosistema-lit)
5. [Ecosistema Open Cells](#5-ecosistema-open-cells)
6. [Ecosistema Storybook](#6-ecosistema-storybook)
7. [Patrones de integración Open Cells (A–E)](#7-patrones-de-integración-open-cells-ae)
8. [CSS: tokens y reglas obligatorias](#8-css-tokens-y-reglas-obligatorias)
9. [Inconvenientes encontrados y soluciones](#9-inconvenientes-encontrados-y-soluciones)
10. [Referencia rápida de componentes y páginas](#10-referencia-rápida-de-componentes-y-páginas)

---

## 1. Stack y versiones

| Paquete | Versión | Rol |
|---|---|---|
| `lit` | 3.3 | Componentes web reactivos |
| `@open-cells/core` | 1.1 | SPA, router hash, canales pub/sub |
| `@open-cells/page-controller` | 1.0 | Reactive Controller para páginas |
| `storybook` | 10.3 | Documentación y testing de componentes |
| `@storybook/web-components-vite` | 10.3 | Integración Storybook + Vite para Web Components |
| `vite` | 8.0 | Bundler (OXC como transformador TS) |
| `typescript` | 5.9 | Tipado estático |
| `pnpm` | — | Gestor de paquetes |

---

## 2. Instalación y comandos

```bash
pnpm install

pnpm dev              # SPA en http://localhost:5173
pnpm storybook        # Storybook en http://localhost:6006
pnpm build            # tsc + vite build (producción)
pnpm build-storybook  # Storybook estático en storybook-static/
```

---

## 3. Estructura del proyecto

```
src/
  components/                    # Lit puro — sin dependencias de Open Cells
    atoms/
      bk-amount/                 # Importe formateado con divisa y color (positivo/negativo)
      bk-avatar/                 # Iniciales o imagen; tamaños sm/md/lg
      bk-badge/                  # Etiqueta de estado: pending / completed / failed
      bk-button/                 # primary, secondary, ghost, danger × sm, md, lg
      bk-chip/                   # Filtro seleccionable por categoría
      bk-input/                  # text, number, password, email + mensaje de error
      bk-spinner/                # Indicador de carga animado
    molecules/
      bk-account-card/           # Alias, saldo (bk-amount), últimos 4 dígitos IBAN
      bk-alert/                  # Notificación: info / success / warning / error
      bk-card/                   # Contenedor base con sombra y radio
      bk-form-field/             # label + bk-input + mensaje de error accesible
      bk-transaction-item/       # Fila: concepto, fecha, bk-chip, bk-amount
    organisms/
      bk-account-summary/        # bk-account-card + botones de acción
      bk-header/                 # Cabecera persistente con navegación
      bk-transaction-list/       # Lista de bk-transaction-item con filtro por chip
      bk-transfer-form/          # Formulario completo con bk-form-field
    services/
      bk-accounts-manager/       # Data Manager — Web Component sin UI (patrón C)
  pages/                         # Conocen Open Cells — usan PageController
    home-page/                   # Dashboard: resumen de cuentas + últimos movimientos
    accounts-page/               # Lista de cuentas con bk-account-card
    account-detail-page/         # Detalle con bk-account-summary + bk-transaction-list
    transfer-page/               # Formulario (solo rol admin)
    login-page/                  # Acceso público
  router/
    routes.ts                    # Route[] para startApp()
    app-index.ts                 # startApp() + interceptor
  services/
    accounts-service.ts          # Constantes de canales + initAccountsService
  mocks/
    accounts.ts                  # Account[] — datos de prueba compartidos
    transactions.ts              # Transaction[]
  css/
    tokens.css                   # CSS custom properties: colores, tipografía, espaciados
    global.css                   # Reset + regla obligatoria de Open Cells
  types/
    open-cells.d.ts              # Declaraciones TypeScript manuales para Open Cells
index.html                       # App shell: bk-accounts-manager, bk-header, #app-content
src/app.ts                       # Punto de entrada: importa CSS, manager y router
.storybook/
  main.ts                        # Configuración Storybook + viteFinal
  preview.ts                     # Parámetros globales: controls, a11y
  cells-decorator.ts             # withCellsBridge — simula el bridge en stories
```

---

## 4. Ecosistema Lit

### Qué es Lit

Lit es una librería minimalista (~5 KB) para crear **Web Components** nativos con reactividad. No es un framework: compila a custom elements estándar del navegador, sin runtime propio.

Añade sobre la plataforma:

- **`LitElement`**: clase base que combina Custom Elements + Shadow DOM + sistema de reactividad.
- **`html` template tag**: tagged template literal con rendering eficiente basado en `TemplateResult`. Solo actualiza los nodos que cambian entre renders, sin Virtual DOM.
- **`css` template tag**: estilos encapsulados en Shadow DOM con `CSSStyleSheet` compartido entre todas las instancias del mismo componente.
- **Decoradores**: `@customElement`, `@property`, `@state`, `@query`, `@queryAll`.

### LitElement — clase base

```ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

@customElement('bk-button')
export class BkButton extends LitElement {

  // Propiedad pública — sincronizada con atributo HTML
  // El atributo se llama igual que la propiedad en kebab-case automáticamente
  @property({ type: String })
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  @property({ type: Boolean })
  disabled = false;

  // Estado interno — no sincronizado con atributo, no expuesto al exterior
  @state()
  private _loading = false;

  // Referencia al DOM interno (Shadow DOM)
  @query('button')
  private _btn!: HTMLButtonElement;

  // Estilos encapsulados — CSSStyleSheet compartido entre instancias
  static styles = css`
    :host { display: inline-block; }
    button[disabled] { opacity: 0.5; }
  `;

  render() {
    return html`
      <button
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('bk-button-click', {
      bubbles: true,
      composed: true,   // necesario para salir del Shadow DOM
    }));
  }
}

// Augment del registro global de TypeScript
declare global {
  interface HTMLElementTagNameMap { 'bk-button': BkButton; }
}
```

### Decoradores clave

| Decorador | Uso | Sincroniza con atributo |
|---|---|---|
| `@property()` | Prop pública observable desde fuera | Sí |
| `@state()` | Estado interno — dispara re-render | No |
| `@query(selector)` | Referencia al DOM interno | — |
| `@queryAll(selector)` | `NodeList` del DOM interno | — |

`@property` acepta opciones:
```ts
@property({ type: Number })          // convierte el atributo string a number
@property({ type: Boolean })         // presencia del atributo = true
@property({ attribute: 'my-alias' }) // nombre de atributo personalizado
@property({ reflect: true })         // escribe el valor de vuelta al atributo
```

### Ciclo de vida reactivo

```
constructor()
  ↓ elemento creado en memoria

connectedCallback()
  ↓ añadido al DOM — aquí se enganchan los Reactive Controllers

scheduleUpdate()
  ↓ Lit encola una microtask si hay cambios pendientes

update(changedProperties: Map)
  ↓ Lit calcula el diff del template

render() → TemplateResult
  ↓ solo actualiza los nodos que cambiaron

firstUpdated(changedProperties)
  ↓ solo en el primer render — equivale a componentDidMount

updated(changedProperties)
  ↓ tras cada render posterior

disconnectedCallback()
  ↓ eliminado del DOM — limpieza de controllers
```

### `updateComplete` — esperar al DOM actualizado

Cuando se modifica un `@state()` o `@property()`, el re-render es asíncrono (microtask). Para esperar:

```ts
this._loading = true;
await this.updateComplete;  // el DOM ya refleja el cambio
```

Útil en tests y stories con `play`.

### Reactive Controllers

Patrón de composición que permite encapsular comportamiento reutilizable sin herencia:

```ts
class ClickTracker implements ReactiveController {
  clickCount = 0;

  constructor(private host: ReactiveControllerHost) {
    host.addController(this);
  }

  hostConnected() {
    this.host.addEventListener('click', this._onClick);
  }

  hostDisconnected() {
    this.host.removeEventListener('click', this._onClick);
  }

  private _onClick = () => {
    this.clickCount++;
    this.host.requestUpdate();  // fuerza re-render del host
  };
}

// En el componente — se instancia, no se hereda
export class MyElement extends LitElement {
  private _tracker = new ClickTracker(this);

  render() {
    return html`Clics: ${this._tracker.clickCount}`;
  }
}
```

`PageController` de Open Cells sigue exactamente este patrón. No es una clase base.

### Shadow DOM y CSS custom properties

Shadow DOM encapsula los estilos: lo que está dentro no afecta fuera y viceversa. La única forma de que estilos externos entren al Shadow DOM son las **CSS custom properties** (variables CSS), que atraviesan el shadow boundary:

```css
/* Fuera del componente (tokens.css) */
:root { --bk-color-primary: #003087; }

/* Dentro del shadow DOM */
:host { color: var(--bk-color-primary); }
```

Los componentes de este proyecto siempre incluyen valores de fallback para ser usables fuera del contexto de la app (en Storybook, en otras aplicaciones):

```ts
static styles = css`
  :host { background: var(--bk-color-surface, #f4f6f9); }
`;
```

### `useDefineForClassFields: false` — obligatorio para Lit

Esta opción es **crítica** y una de las configuraciones más contraintuitivas del stack. Con `true` (el default en TypeScript para targets ES2022+), los campos de clase se inicializan con `Object.defineProperty` en el constructor, **antes** de que `LitElement` ejecute su propia lógica de `createProperty`. Esto hace que `@property` y `@state` no funcionen correctamente.

```json
// tsconfig.json
"useDefineForClassFields": false,
"experimentalDecorators": true
```

Con `experimentalDecorators: true`, TypeScript emite el patrón `__decorate(...)` en lugar de los decoradores TC39 nativos. Vite 8 usa OXC como transformador, que no transforma decoradores TC39 al ejecutar en el navegador; por eso se necesita el patrón `__decorate` que sí es JavaScript válido hoy.

### Eventos personalizados — convención del proyecto

```ts
// Emitir
this.dispatchEvent(new CustomEvent('bk-transfer-submit', {
  bubbles: true,
  composed: true,   // necesario para salir del Shadow DOM
  detail: { iban, amount, concept }
}));

// Escuchar en Lit
html`<bk-transfer-form @bk-transfer-submit=${this._handleSubmit}></bk-transfer-form>`

// Escuchar en HTML vanilla
document.querySelector('bk-transfer-form')
  .addEventListener('bk-transfer-submit', (e) => console.log(e.detail));
```

Formato de nombres: `bk-[componente]-[acción]` (ej. `bk-button-click`, `bk-field-input`).

---

## 5. Ecosistema Open Cells

### Qué es Open Cells

Framework SPA de BBVA construido sobre Web Components estándar. Aporta:

- **Router** basado en hash (`#/ruta`) con carga lazy de páginas.
- **Sistema de canales pub/sub** implementado con `ReplaySubject(1)` de RxJS.
- **`PageController`**: Reactive Controller que conecta una página con el router y los canales.
- **`ElementController`**: parte interna que gestiona `inbounds`/`outbounds` declarativos.
- **Interceptor**: middleware de navegación (autenticación, guardias).

### `startApp()` — la configuración completa

```ts
import { startApp } from '@open-cells/core';

startApp({
  routes,                        // Route[] — ver routes.ts

  mainNode: 'app-content',       // id del nodo DOM donde se inyectan las páginas
                                  // Las páginas se añaden/eliminan como hijos de este nodo

  persistentPages: ['home'],     // estas páginas nunca se destruyen del DOM
                                  // permanecen con state="inactive" al salir de ellas
                                  // NO cuentan para el viewLimit

  viewLimit: 2,                  // máximo de páginas no persistentes en caché simultáneas
                                  // por defecto: 3
                                  // cuando se supera: la más antigua con state="cached" se destruye

  interceptor: {
    condition: (page: string) => Boolean(/* true → redirigir */),
    redirect: { page: 'login' }, // OBJETO, no string
  },

  skipNavigations: [
    { from: 'login', to: 'login' },  // evita ciclos de redirección
    // from y to son opcionales
  ],
});
```

### Routes — definición

```ts
export const routes: Route[] = [
  {
    path: 'login',           // segmento de hash: #/login
    name: 'login',           // nombre usado en navigate('login')
    component: 'login-page', // tag del custom element
    import: () => import('../pages/login-page/login-page.ts'),  // lazy load
  },
  {
    path: 'account/:id',     // parámetro de ruta
    name: 'account-detail',
    component: 'account-detail-page',
    import: () => import('../pages/account-detail-page/account-detail-page.ts'),
  },
];
```

### `PageController` — uso correcto

```ts
// CORRECTO — es un Reactive Controller, se instancia
export class MyPage extends LitElement {
  private _pageController = new PageController(this);

  onPageEnter(params?: Record<string, string>) {
    // params contiene los parámetros de ruta: { id: 'acc-001' }
  }

  onPageLeave() {
    // limpieza — desuscribir canales suscritos manualmente (opción A)
  }

  private _navigate() {
    this._pageController.navigate('home');
    this._pageController.navigate('account-detail', { id: 'acc-001' });
  }
}

// INCORRECTO — PageController no es una clase base
export class MyPage extends PageController { }  // ❌
```

### Ciclo de vida de una página

```
navigate('my-page')
  ↓
Open Cells crea el componente (o lo saca del caché)
  ↓
onPageEnter(params?)         // suscribirse a canales, inicializar estado
  ↓
[usuario navega fuera]
  ↓
onPageLeave()                // desuscribir canales (solo opción A)
  ↓
página → state="cached" (guardada) o destruida (si excede viewLimit)
```

### Canales pub/sub — cómo funcionan internamente

Los canales son **`ReplaySubject(1)`** de RxJS. Guardan el **último valor publicado** y lo emiten inmediatamente a cualquier suscriptor nuevo, aunque la suscripción llegue después de la publicación.

```
publish(channel, value)
  → ComponentConnector: new CustomEvent(channel, { detail: value })
  → dispatchActionFunction: callback(event.detail)
  → el callback recibe el DATO BRUTO (no un wrapper)
```

```ts
// Publicar
this._pageController.publish('bk:accounts', accounts);

// Suscribir
this._pageController.subscribe<Account[]>('bk:accounts', (accounts) => {
  // accounts es Account[] directamente — NO { value: Account[] }
  this._accounts = accounts;
});

// Desuscribir (necesario en onPageLeave si se usó subscribe manual)
this._pageController.unsubscribe(['bk:accounts', 'bk:transactions']);
```

### Interceptor — autenticación global

```ts
const PUBLIC_PAGES = ['login'];

interceptor: {
  condition: (page: string) => {
    const hasSession = Boolean(sessionStorage.getItem('bk-user'));
    if (!hasSession && !PUBLIC_PAGES.includes(page)) {
      // Guardar el destino para redirect-after-login
      sessionStorage.setItem('bk-pending-page', page);
      return true;   // redirigir
    }
    return false;    // dejar pasar
  },
  redirect: { page: 'login' },
}
```

El interceptor es el lugar correcto para **autenticación** (¿hay sesión?). La **autorización** granular (¿tiene permisos para esta acción?) se delega a cada página en `onPageEnter`, porque es allí donde el componente tiene acceso a `navigate` para dar feedback al usuario.

### `persistentPages` + `viewLimit` — gestión de memoria

```
Con persistentPages: ['home'] y viewLimit: 2:

navigate('home')          state=active
navigate('accounts')      home=inactive(persistente), accounts=active
navigate('account-detail') home=inactive, accounts=cached, account-detail=active
navigate('transfer')      home=inactive, accounts=DESTRUIDA (límite), account-detail=cached, transfer=active
navigate('home')          home=active (siempre estuvo, no se recarga desde cero)
```

`persistentPages` es útil para páginas hub (home, menú principal) que no deben re-fetching datos al volver. El `onPageEnter` sigue ejecutándose, pero las propiedades del componente (incluyendo las de `inbounds`) mantienen su valor.

### Componentes persistentes fuera del router

`bk-header` y `bk-accounts-manager` viven en el app shell (`index.html`), fuera de `#app-content`. El router no los gestiona. Para navegar desde ellos, se usa el `navigate` global del módulo `@open-cells/core`:

```ts
import { navigate } from '@open-cells/core';
navigate('home');
```

```html
<!-- index.html -->
<div id="app">
  <bk-accounts-manager></bk-accounts-manager>  <!-- Data Manager -->
  <bk-header id="bk-header"></bk-header>        <!-- Cabecera persistente -->
  <main id="app-content"></main>                <!-- Páginas del router -->
</div>
```

---

## 6. Ecosistema Storybook

### Configuración para Web Components con Vite

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts)'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  addons: [
    '@storybook/addon-links',
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  async viteFinal(config) {
    // Pre-bundlear Open Cells para evitar errores de ESM en el primer arranque
    config.optimizeDeps = {
      include: ['@open-cells/core', '@open-cells/page-controller', 'lit'],
    };
    return config;
  },
};
```

El `viteFinal` con `optimizeDeps.include` es necesario porque Open Cells tiene módulos ESM que Vite no pre-bundlea automáticamente. Sin esto, el primer arranque de Storybook puede fallar con errores de resolución de módulos.

### Estructura de una story de componente

```ts
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-button.ts';

const meta: Meta = {
  title: 'Atoms/BkButton',
  component: 'bk-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    disabled: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',    // 'centered' | 'fullscreen' | 'padded'
    docs: {
      description: {
        component: 'Descripción que aparece en la pestaña Docs.',
      },
    },
  },
};
export default meta;

export const Primary: StoryObj = {
  name: 'Primary',
  args: { variant: 'primary', label: 'Transferir', disabled: false },
  render: ({ variant, label, disabled }) =>
    html`<bk-button variant=${variant} ?disabled=${disabled}>${label}</bk-button>`,
};
```

### `argTypes` — controles disponibles

| Control | Tipo TypeScript | Uso |
|---|---|---|
| `text` | `string` | Texto libre |
| `number` | `number` | Numérico |
| `boolean` | `boolean` | Checkbox |
| `select` | `string` | Desplegable con `options: []` |
| `radio` | `string` | Botones de radio con `options: []` |
| `color` | `string` | Selector de color |
| `date` | `Date` | Selector de fecha |
| `object` | `object` | JSON editable |
| `inline-radio` | `string` | Radio en línea |

### `play` — automatización e inyección de estados

La función `play` se ejecuta después del render inicial. Permite simular interacciones o inyectar estados que de otro modo requerirían acción del usuario:

```ts
export const Loading: StoryObj = {
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('login-page') as any;
    el._pageController.navigate = fn().mockName('navigate');

    // Inyectar estado interno directamente
    el._loading = true;
    el._email = 'demo@bank.es';
    el.requestUpdate();        // forzar re-render tras modificar @state
    await el.updateComplete;   // esperar a que el DOM refleje el cambio
  },
};
```

### Decorator `withCellsBridge` — simular el bridge

Las páginas Open Cells necesitan que `navigate` esté disponible. En Storybook no hay router. El decorator parchea navigate con un spy:

```ts
// .storybook/cells-decorator.ts
import type { Decorator } from '@storybook/web-components';
import { fn } from 'storybook/test';

export const withCellsBridge: Decorator = (story, context) => {
  const navigateFn = fn().mockName('navigate');
  context.args['navigateFn'] = navigateFn;
  return story();   // 0 argumentos — ver gotcha sobre TS2554
};

// En la story
const meta: Meta = {
  decorators: [withCellsBridge],
  parameters: { layout: 'fullscreen' },
};
```

### `fireInbound` — inyectar datos en inbounds declarativos

Cuando una página usa `static inbounds`, `ElementController` define las propiedades con `Object.defineProperties` sin `configurable: true`. No se pueden redefinir con `Object.defineProperty`. La solución es llamar directamente a la `action` de la suscripción interna:

```ts
function fireInbound(el: any, channelName: string, value: unknown) {
  const sub = el._pageController.subscriptions.find(
    (s: { channel: string }) => s.channel === channelName,
  );
  sub?.action(value);
  // Replica exactamente el flujo del canal:
  //   canal.next(value) → wrapCallback → dispatchActionFunction → action(value)
}

// Uso en play
export const Default: StoryObj = {
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('accounts-page') as any;
    el._pageController.navigate = fn().mockName('navigate');
    fireInbound(el, CHANNEL_ACCOUNTS, ACCOUNTS);
  },
};
```

### `storybook/test` — utilidades de testing

En Storybook 10 el paquete se renombró:

```ts
import { fn, expect, within, userEvent } from 'storybook/test';
// No: import { fn } from '@storybook/test';  ← solo en Storybook 8/9
```

`fn()` crea un spy (mock function) que registra sus llamadas. Las llamadas aparecen en el panel **Actions** de Storybook.

### Addons instalados

```bash
pnpm add -D \
  storybook@^10 \
  @storybook/web-components@^10 \
  @storybook/web-components-vite@^10 \
  @storybook/addon-docs@^10 \
  @storybook/addon-a11y@^10 \
  @storybook/addon-links@^10 \
  @chromatic-com/storybook
```

> En Storybook 10 no existe `@storybook/addon-essentials` como paquete independiente.
> Cada addon se instala y registra por separado.

---

## 7. Patrones de integración Open Cells (A–E)

### Opción A — `subscribe`/`unsubscribe` imperativo

Adecuado cuando la suscripción depende de lógica dinámica (parámetros de ruta, condiciones).

```ts
// account-detail-page.ts
onPageEnter(params?: Record<string, string>) {
  this._loading = true;
  const id = params?.id ?? '';

  // Los canales son ReplaySubject(1): si ya hay un valor publicado,
  // el callback se ejecuta inmediatamente (sin esperar)
  this._pageController.subscribe<Account[]>(CHANNEL_ACCOUNTS, (accounts) => {
    this._account = accounts.find(a => a.id === id) ?? null;
    this._loading = false;
  });

  this._pageController.subscribe<Transaction[]>(CHANNEL_TRANSACTIONS, (transactions) => {
    this._transactions = transactions.filter(t => t.accountId === id);
  });
}

onPageLeave() {
  // Desuscribir al salir para evitar actualizaciones fantasma
  this._pageController.unsubscribe([CHANNEL_ACCOUNTS, CHANNEL_TRANSACTIONS]);
}
```

### Opción B — `static inbounds` / `outbounds` declarativos

`ElementController` lee estas propiedades estáticas y gestiona el ciclo de vida completo: suscripción en `hostConnected`, getter en el host, `requestUpdate()` al recibir datos, desuscripción en `hostDisconnected`.

```ts
// accounts-page.ts
static inbounds: Record<string, InboundDef> = {
  accounts: {
    channel: CHANNEL_ACCOUNTS,
    // skipUpdate: true — no llamar requestUpdate (para datos de solo lectura en efectos)
  },
  recentTransactions: {
    channel: CHANNEL_TRANSACTIONS,
    // action transforma el valor antes de guardarlo en la propiedad
    action: (all) => (all as Transaction[])
      .filter(t => t.accountId === 'acc-001')
      .slice(0, 5),
  },
};

// declare informa a TypeScript del tipo sin crear la propiedad real
// (la crea ElementController vía Object.defineProperties sin configurable: true)
declare accounts: Account[] | undefined;
declare recentTransactions: Transaction[] | undefined;
```

```ts
// bk-accounts-manager.ts — outbounds
static outbounds: Record<string, OutboundDef> = {
  accounts: { channel: CHANNEL_ACCOUNTS },
};
declare accounts: Account[];

// Al asignar this.accounts = data:
//   setter generado por ElementController → publish(CHANNEL_ACCOUNTS, data)
override firstUpdated() {
  this.accounts = ACCOUNTS;
}
```

### Opción C — Data Manager como Web Component

Componente sin UI que vive en el app shell. Al iniciarse publica datos en canales. Como los canales son `ReplaySubject(1)`, cualquier página que se suscriba después recibirá los datos inmediatamente.

```html
<!-- index.html — fuera de #app-content, siempre en el DOM -->
<bk-accounts-manager></bk-accounts-manager>
<main id="app-content"></main>
```

```ts
@customElement('bk-accounts-manager')
export class BkAccountsManager extends LitElement {
  private _pc = new PageController(this);  // necesario para que outbounds funcionen

  static outbounds: Record<string, OutboundDef> = {
    accounts: { channel: CHANNEL_ACCOUNTS },
    transactions: { channel: CHANNEL_TRANSACTIONS },
  };

  declare accounts: Account[];
  declare transactions: Transaction[];

  // Sin Shadow DOM — no hay nada que encapsular
  protected override createRenderRoot() { return this; }

  override firstUpdated() {
    void this._pc;              // referencia explícita para evitar TS noUnusedLocals
    this.accounts = ACCOUNTS;   // → publish automático
    this.transactions = TRANSACTIONS;
  }
}
```

En producción, reemplazar los imports de mocks por llamadas `fetch` a la API real.

### Opción D — Interceptor avanzado

Separación de responsabilidades: el interceptor es stateless y solo verifica autenticación. La autorización granular va en cada página.

```ts
// app-index.ts — autenticación global
const PUBLIC_PAGES = ['login'];

interceptor: {
  condition: (page: string) => {
    const hasSession = Boolean(sessionStorage.getItem('bk-user'));
    if (!hasSession && !PUBLIC_PAGES.includes(page)) {
      sessionStorage.setItem('bk-pending-page', page); // para redirect-after-login
      return true;
    }
    return false;
  },
  redirect: { page: 'login' },
},
skipNavigations: [{ from: 'login', to: 'login' }],
```

```ts
// login-page.ts — redirect-after-login
sessionStorage.setItem('bk-user', JSON.stringify({ email, ...user }));
const pending = sessionStorage.getItem('bk-pending-page') ?? 'home';
sessionStorage.removeItem('bk-pending-page');
this._pageController.navigate(pending);
```

```ts
// transfer-page.ts — autorización por rol en onPageEnter
onPageEnter() {
  const user = JSON.parse(sessionStorage.getItem('bk-user') ?? 'null');
  if (user?.role !== 'admin') {
    this._accessDenied = true;
    this.requestUpdate();
    return;
  }
  // flujo normal
}
```

Claves de `sessionStorage` usadas:
- `bk-user` → `{ email, name, role: 'regular' | 'admin' }`
- `bk-pending-page` → nombre de la ruta intentada antes del login

### Opción E — `persistentPages` + `viewLimit`

```ts
startApp({
  persistentPages: ['home'],   // home nunca se destruye
  viewLimit: 2,                // solo 2 páginas no persistentes en caché
});
```

Comportamiento con `viewLimit: 2` en un flujo típico:

```
navigate('accounts')       → [home:inactive*, accounts:active]
navigate('account-detail') → [home:inactive*, accounts:cached, account-detail:active]
navigate('transfer')       → [home:inactive*, account-detail:cached, transfer:active]
                               └── accounts DESTRUIDA (superó el límite)
navigate('home')           → [home:active*, transfer:cached]
                               └── home nunca fue destruida — sin flash de loading
```

`*` = persistente, no cuenta para el límite.

---

## 8. CSS: tokens y reglas obligatorias

### tokens.css — design system bancario

```css
:root {
  /* Colores */
  --bk-color-primary:       #003087;
  --bk-color-primary-hover: #00236b;
  --bk-color-secondary:     #0066cc;
  --bk-color-success:       #007a3d;
  --bk-color-warning:       #f5a623;
  --bk-color-danger:        #c0392b;
  --bk-color-info:          #0066cc;
  --bk-color-surface:       #f4f6f9;
  --bk-color-border:        #d1d9e0;
  --bk-color-text:          #1a1a2e;
  --bk-color-text-muted:    #6b7280;

  /* Tipografía */
  --bk-font-sans: 'Inter', system-ui, sans-serif;
  --bk-font-mono: 'Roboto Mono', monospace;   /* importes y IBANs */

  /* Espaciados */
  --bk-space-1: 0.25rem;   --bk-space-2: 0.5rem;
  --bk-space-3: 0.75rem;   --bk-space-4: 1rem;
  --bk-space-6: 1.5rem;    --bk-space-8: 2rem;

  /* Bordes y sombras */
  --bk-radius-card: 12px;
  --bk-shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
  --bk-shadow-md:   0 4px 16px rgba(0, 0, 0, 0.12);
}
```

Los componentes consumen tokens con fallback para usabilidad fuera del contexto de la app:

```ts
// Siempre con valor de fallback
background: var(--bk-color-surface, #f4f6f9);
```

### global.css — regla obligatoria de Open Cells

**Sin esto, todas las páginas son visibles al mismo tiempo:**

```css
#app-content > [state="cached"],
#app-content > [state="inactive"] {
  display: none;
}
```

Open Cells añade el atributo `state` a los custom elements de página (`state="active"`, `state="cached"`, `state="inactive"`). Esta regla CSS oculta todas las páginas que no están activas.

---

## 9. Inconvenientes encontrados y soluciones

### 1. Open Cells no tiene tipos TypeScript

**Problema**: `@open-cells/core` y `@open-cells/page-controller` son paquetes JavaScript puro sin archivos `.d.ts`. La carpeta `types/` del paquete contiene archivos `.ts` fuente (no compilados), incompatibles con `verbatimModuleSyntax`. Se producen dos errores distintos:

```
error TS7016: Could not find a declaration file for module '@open-cells/core'
error TS1484: 'NavigationWithParams' is a type and must be imported using a type-only import
```

`skipLibCheck: true` **no resuelve el problema**. Esa opción omite el chequeo de archivos `.d.ts` en `node_modules`, pero el error ocurre al importar desde el proyecto propio — TypeScript intenta leer los `.ts` fuente del paquete.

**Solución**: crear declaraciones manuales en `src/types/open-cells.d.ts` y redirigir la resolución de módulos con `paths` en `tsconfig.json`:

```json
"paths": {
  "@open-cells/core": ["./src/types/open-cells.d.ts"],
  "@open-cells/core/types": ["./src/types/open-cells.d.ts"],
  "@open-cells/page-controller": ["./src/types/open-cells.d.ts"]
}
```

Esto hace que TypeScript use los stubs locales en lugar de intentar leer el código fuente del paquete.

---

### 2. `PageController` no es una clase base

**Problema**: la documentación de Open Cells (y muchos ejemplos en internet) muestra `class MyPage extends PageController`. Esto causa:

```
TypeError: proto.constructor.createProperty is not a function
```

Los decoradores de Lit (`@state`, `@property`) buscan el método estático `createProperty` en la cadena de herencia. Si la clase no extiende `LitElement`, no existe ese método.

**Solución**: `PageController` es un Reactive Controller. Se instancia, no se hereda:

```ts
// ✅ correcto
export class MyPage extends LitElement {
  private _pageController = new PageController(this);
}

// ❌ incorrecto — los decoradores de Lit no funcionan
export class MyPage extends PageController { }
```

---

### 3. Los callbacks de canal reciben el dato bruto, no un wrapper `{ value }`

**Problema**: al asumir que el canal emite un objeto `{ value: T }` (como sugieren algunos ejemplos), los callbacks reciben datos incorrectos:

```ts
// ❌ incorrecto — { value } siempre es undefined
this._pageController.subscribe('bk:accounts', ({ value }: { value: Account[] }) => {
  this._accounts = value;
});
```

**Por qué**: el flujo interno de Open Cells es:
```
publish(channel, VALUE)
  → ComponentConnector: new CustomEvent(channel, { detail: VALUE })
  → dispatchActionFunction: callback(event.detail)  ← = VALUE bruto
```

**Solución**:

```ts
// ✅ correcto — el callback recibe el dato directamente
this._pageController.subscribe<Account[]>('bk:accounts', (accounts) => {
  this._accounts = accounts;
});
```

Lo mismo aplica a las stories: `fireInbound(el, channel, ACCOUNTS)`, no `fireInbound(el, channel, { value: ACCOUNTS })`.

---

### 4. `TypeError: Cannot redefine property: accounts` en Storybook

**Problema**: al intentar inyectar datos en una story usando `Object.defineProperty` sobre una propiedad creada por `static inbounds`:

```ts
// ❌ lanza TypeError en runtime
Object.defineProperty(el, 'accounts', {
  get: () => ACCOUNTS,
  configurable: true,
});
```

**Por qué**: `ElementController._inOut` define las propiedades de `inbounds` con `Object.defineProperties` internamente, **sin pasar `configurable: true`**. Una propiedad no configurable no puede ser redefinida bajo ningún concepto.

**Solución**: acceder a la función `action` de la suscripción interna y llamarla directamente. Esto replica exactamente lo que hace el canal cuando emite un valor:

```ts
function fireInbound(el: any, channelName: string, value: unknown) {
  const sub = el._pageController.subscriptions.find(
    (s: { channel: string }) => s.channel === channelName,
  );
  sub?.action(value);
}
```

`el._pageController.subscriptions` es el array interno donde `ElementController` guarda los objetos `{ channel, action }` creados al procesar `static inbounds`.

---

### 5. `noUnusedLocals` con campos de clase que tienen efectos secundarios

**Problema**: TypeScript con `noUnusedLocals: true` reporta error en campos de clase instanciados pero nunca referenciados, incluso con el prefijo `_`:

```
error TS6133: '_pc' is declared but its value is never read.
```

El campo tiene un efecto secundario real: al instanciar `PageController(this)`, el controller se registra con `addController(this)` y eso hace que `ElementController` procese `static outbounds`. Sin esa instanciación, los outbounds no funcionan. Pero TypeScript no puede inferir ese efecto.

**Solución**: referenciar explícitamente el campo con `void` en un método del ciclo de vida:

```ts
override firstUpdated() {
  void this._pc;          // documenta el efecto secundario
  this.accounts = ACCOUNTS;
}
```

---

### 6. `TS2554: Expected 0-1 arguments, got 2` en el decorator de Storybook

**Problema**: el tipo `Decorator` de `@storybook/web-components` define `story` como una función de 0 o 1 argumento. Llamarla con `(context.args, context)` causa error TypeScript:

```ts
// ❌ TS2554
export const withCellsBridge: Decorator = (story, context) => {
  return story(context.args, context);
};
```

**Solución**: llamar `story()` sin argumentos. Los `args` del contexto ya están disponibles en la story a través de sus propios mecanismos:

```ts
// ✅
export const withCellsBridge: Decorator = (story, context) => {
  context.args['navigateFn'] = fn().mockName('navigate');
  return story();
};
```

---

### 7. `@storybook/test` no existe en Storybook 10

**Problema**: toda la documentación oficial y los snippets de Storybook 8/9 usan `@storybook/test`. En Storybook 10 ese paquete fue absorbido por el paquete principal y el import cambió:

```ts
import { fn } from '@storybook/test';  // ❌ no existe en Storybook 10
import { fn } from 'storybook/test';   // ✅ correcto en Storybook 10
```

---

### 8. `interceptor.redirect` debe ser un objeto, no un string

**Problema**: el tipo de `redirect` no es intuitivo. Pasarlo como string no produce error TypeScript (si no hay tipos estrictos) pero no funciona en runtime:

```ts
// ❌ no funciona
redirect: 'login'

// ✅ correcto
redirect: { page: 'login' }
```

---

### 9. `skipNavigations` requiere objetos, no strings

```ts
// ❌ incorrecto
skipNavigations: ['login']

// ✅ correcto — array de objetos; from y to son opcionales
skipNavigations: [
  { from: 'login', to: 'login' },   // evita bucle login→login cuando el interceptor redirige
]
```

---

### 10. `optimizeDeps` de Vite necesario para Open Cells en Storybook

**Problema**: Open Cells usa módulos ESM que Vite no detecta automáticamente para pre-bundlear. El primer arranque de Storybook puede fallar con errores de tipo:

```
[vite] Failed to resolve import "@open-cells/core"
```

**Solución**: añadir en `viteFinal` de `.storybook/main.ts`:

```ts
async viteFinal(config) {
  config.optimizeDeps = {
    include: ['@open-cells/core', '@open-cells/page-controller', 'lit'],
  };
  return config;
}
```

---

## 10. Referencia rápida de componentes y páginas

### Convenciones del proyecto

- Prefijo `bk-` en todos los custom elements (`bk-button`, `bk-card`, etc.)
- Propiedades públicas con `@property()`, estado interno con `@state()`
- Nombres de eventos: `bk-[componente]-[acción]`
- Estilos en `static styles = css\`...\``; tokens con valores de fallback
- Componentes en `src/components/` nunca importan de `@open-cells/*`
- Páginas en `src/pages/` conocen `PageController` y el router

### Átomos

| Componente | Propiedades clave | Eventos |
|---|---|---|
| `bk-button` | `variant`, `size`, `disabled`, `loading` | `bk-button-click` |
| `bk-input` | `type`, `value`, `label`, `error`, `required` | `bk-input-change` |
| `bk-badge` | `status`: pending / completed / failed | — |
| `bk-amount` | `amount` (number), `currency`, `positive` (bool) | — |
| `bk-avatar` | `name`, `size`: sm / md / lg, `src` | — |
| `bk-spinner` | — | — |
| `bk-chip` | `label`, `selected` | `bk-chip-toggle` |

### Moléculas

| Componente | Propiedades clave | Eventos |
|---|---|---|
| `bk-card` | slot default | — |
| `bk-account-card` | `alias`, `iban`, `balance`, `currency` | — |
| `bk-transaction-item` | `concept`, `date`, `amount`, `category`, `type` | — |
| `bk-form-field` | `label`, `name`, `type`, `value`, `error`, `required` | `bk-field-input` |
| `bk-alert` | `type`: info / success / warning / error, `message` | — |

### Organismos

| Componente | Propiedades clave | Eventos |
|---|---|---|
| `bk-account-summary` | `alias`, `iban`, `balance`, `currency`, `loading` | `bk-summary-transfer`, `bk-summary-details` |
| `bk-transaction-list` | `.transactions` (array), `loading` | — |
| `bk-transfer-form` | `loading`, `successMessage`, `errorMessage` | `bk-transfer-submit`, `bk-transfer-cancel` |
| `bk-header` | — | navega con `navigate` global de Open Cells |

### Páginas y rutas

| Página | Ruta | Acceso | Patrón de datos |
|---|---|---|---|
| `login-page` | `#/login` | Pública | Estado interno |
| `home-page` | `#/home` | Autenticado | Inbounds B (dos canales + action) |
| `accounts-page` | `#/accounts` | Autenticado | Inbound B (canal accounts) |
| `account-detail-page` | `#/account/:id` | Autenticado | Subscribe A (parámetros de ruta) |
| `transfer-page` | `#/transfer` | Admin | Estado interno + guardia de rol |

### Credenciales de demo

| Email | Contraseña | Rol | Acceso |
|---|---|---|---|
| `demo@bank.es` | `1234` | `regular` | home, accounts, account-detail |
| `admin@bank.es` | `admin` | `admin` | todo, incluyendo transfer |
