import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { fn } from 'storybook/test';
import { withCellsBridge } from '../../../.storybook/cells-decorator.ts';
import './login-page.ts';

const meta: Meta = {
  title: 'Pages/LoginPage',
  component: 'login-page',
  decorators: [withCellsBridge],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Página de acceso con dos credenciales de demo:

| Email | Contraseña | Rol |
|---|---|---|
| \`demo@bank.es\` | \`1234\` | regular — sin acceso a /transfer |
| \`admin@bank.es\` | \`admin\` | admin — acceso completo |

**Redirect-after-login**: si el interceptor redirigió al usuario desde una ruta
protegida, guarda el destino en \`sessionStorage\`. Tras el login exitoso,
la página navega al destino original en lugar de ir siempre a \`home\`.

> **Patrón Cells en Storybook**: \`navigate\` está parcheado con un spy —
> cada llamada aparece en el panel *Actions* sin necesitar router real.
        `,
      },
    },
  },
};
export default meta;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: StoryObj = {
  name: 'Default',
  render: () => html`<login-page></login-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('login-page') as any;
    if (!el) return;
    el._pageController.navigate = fn().mockName('navigate');
  },
};

// ─── WithError ────────────────────────────────────────────────────────────────

export const WithError: StoryObj = {
  name: 'WithError',
  render: () => html`<login-page></login-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('login-page') as any;
    if (!el) return;
    el._pageController.navigate = fn().mockName('navigate');
    // Simula un intento fallido de login
    el._error = 'Credenciales incorrectas. Prueba demo@bank.es / 1234';
    el.requestUpdate();
  },
};

// ─── Loading ──────────────────────────────────────────────────────────────────

export const Loading: StoryObj = {
  name: 'Loading',
  render: () => html`<login-page></login-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('login-page') as any;
    if (!el) return;
    el._pageController.navigate = fn().mockName('navigate');
    // Simula que la petición de auth está en curso
    el._loading = true;
    el._email = 'demo@bank.es';
    el._password = '1234';
    el.requestUpdate();
  },
};

// ─── RedirectAfterLogin — interceptor guardó destino pendiente ────────────────

export const RedirectAfterLogin: StoryObj = {
  name: 'RedirectAfterLogin',
  render: () => html`<login-page></login-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('login-page') as any;
    if (!el) return;
    const navigateFn = fn().mockName('navigate');
    el._pageController.navigate = navigateFn;

    // Simula que el interceptor guardó 'accounts' como destino pendiente
    sessionStorage.removeItem('bk-user');
    sessionStorage.setItem('bk-pending-page', 'accounts');
    // Al hacer login, navigate debería llamarse con 'accounts', no con 'home'
  },
};
