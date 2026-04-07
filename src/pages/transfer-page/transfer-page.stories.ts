import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { fn } from 'storybook/test';
import { withCellsBridge } from '../../../.storybook/cells-decorator.ts';
import './transfer-page.ts';

const meta: Meta = {
  title: 'Pages/TransferPage',
  component: 'transfer-page',
  decorators: [withCellsBridge],
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Formulario de transferencia restringido a usuarios con rol **admin**.

**Guardia de rol en \`onPageEnter\`**: el interceptor garantiza que hay sesión,
pero la autorización fina (rol admin) la verifica la propia página. Si el usuario
no tiene permisos, renderiza \`bk-alert\` en lugar del formulario.

Las stories *Success* y *Error* inyectan el mensaje de respuesta directamente
en el estado interno del componente, igual que haría la API real en la SPA.
        `,
      },
    },
  },
};
export default meta;

// ─── Default (formulario vacío) ───────────────────────────────────────────────

export const Default: StoryObj = {
  name: 'Default',
  render: () => html`<transfer-page></transfer-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('transfer-page') as any;
    if (!el) return;
    await el.updateComplete;
    el._pageController.navigate = fn().mockName('navigate');
    el.onPageEnter();
  },
};

// ─── Loading (petición en curso) ──────────────────────────────────────────────

export const Loading: StoryObj = {
  name: 'Loading',
  render: () => html`<transfer-page></transfer-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('transfer-page') as any;
    if (!el) return;
    await el.updateComplete;
    el._pageController.navigate = fn().mockName('navigate');
    el.onPageEnter();
    // Simula que la API aún no ha respondido
    el._loading = true;
    el.requestUpdate();
  },
};

// ─── Success (transferencia completada) ───────────────────────────────────────

export const Success: StoryObj = {
  name: 'Success',
  render: () => html`<transfer-page></transfer-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('transfer-page') as any;
    if (!el) return;
    await el.updateComplete;
    el._pageController.navigate = fn().mockName('navigate');
    el.onPageEnter();
    // Inyecta el mensaje de éxito que devolvería la API
    el._successMessage = 'Transferencia de 250,00 € a ···6789 enviada correctamente.';
    el._loading = false;
    el.requestUpdate();
  },
};

// ─── Error (fallo en la API) ──────────────────────────────────────────────────

export const Error: StoryObj = {
  name: 'Error',
  render: () => html`<transfer-page></transfer-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('transfer-page') as any;
    if (!el) return;
    await el.updateComplete;
    el._pageController.navigate = fn().mockName('navigate');
    el.onPageEnter();
    // Inyecta el mensaje de error que devolvería la API
    el._errorMessage = 'No se pudo procesar la transferencia. Inténtalo de nuevo.';
    el._loading = false;
    el.requestUpdate();
  },
};

// ─── AccessDenied (usuario sin rol admin) ─────────────────────────────────────

export const AccessDenied: StoryObj = {
  name: 'AccessDenied',
  render: () => html`<transfer-page></transfer-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('transfer-page') as any;
    if (!el) return;
    await el.updateComplete;
    el._pageController.navigate = fn().mockName('navigate');
    // Simula sesión de usuario regular (sin rol admin)
    sessionStorage.setItem('bk-user', JSON.stringify({ email: 'demo@bank.es', name: 'Ana García', role: 'regular' }));
    el.onPageEnter();
    await el.updateComplete;
  },
};
