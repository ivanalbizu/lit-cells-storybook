import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { fn } from 'storybook/test';
import { withCellsBridge } from '../../../.storybook/cells-decorator.ts';
import { ACCOUNTS } from '../../mocks/accounts.ts';
import { CHANNEL_ACCOUNTS } from '../../services/accounts-service.ts';
import './accounts-page.ts';

/**
 * OPCIÓN B — inbounds declarativos en Storybook.
 *
 * ElementController._inOut define la propiedad con Object.defineProperties
 * sin `configurable: true`, por lo que no se puede redefinir.
 *
 * La forma correcta de inyectar datos es llamar directamente a la `action`
 * de la suscripción guardada en `_pageController.subscriptions`. Esto replica
 * exactamente lo que el canal haría al emitir un valor.
 */
const meta: Meta = {
  title: 'Pages/AccountsPage',
  component: 'accounts-page',
  decorators: [withCellsBridge],
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Lista de cuentas. Usa **inbounds declarativos** (opción B): \`static inbounds\`
en la clase declara el canal \`bk:accounts\`. \`ElementController\` gestiona
la suscripción automáticamente en \`hostConnected\` y la limpieza en
\`hostDisconnected\`.

El componente simplemente lee \`this.accounts\` — no sabe nada del canal.
        `,
      },
    },
  },
};
export default meta;

/**
 * Dispara la action interna de una suscripción de inbound con datos mock.
 * Replica exactamente lo que el canal haría al emitir un valor:
 *   canal.next(value) → wrapCallback → dispatchActionFunction → action(value)
 */
function fireInbound(el: any, channelName: string, value: unknown) {
  const sub = el._pageController.subscriptions.find(
    (s: { channel: string }) => s.channel === channelName,
  );
  sub?.action(value);
}

// ─── Default (datos cargados) ──────────────────────────────────────────────────

export const Default: StoryObj = {
  name: 'Default',
  render: () => html`<accounts-page></accounts-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('accounts-page') as any;
    if (!el) return;
    await el.updateComplete; // esperar a que Lit conecte el controller y registre subscriptions

    el._pageController.navigate = fn().mockName('navigate');
    fireInbound(el, CHANNEL_ACCOUNTS, ACCOUNTS);
  },
};

// ─── Loading (sin datos aún) ───────────────────────────────────────────────────

export const Loading: StoryObj = {
  name: 'Loading',
  render: () => html`<accounts-page></accounts-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('accounts-page') as any;
    if (!el) return;

    el._pageController.navigate = fn().mockName('navigate');
    // No llamamos a fireInbound → accounts = undefined → muestra bk-spinner
  },
};
