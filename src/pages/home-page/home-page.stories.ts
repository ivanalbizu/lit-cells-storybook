import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { fn } from 'storybook/test';
import { withCellsBridge } from '../../../.storybook/cells-decorator.ts';
import { ACCOUNTS } from '@/mocks/accounts.ts';
import { TRANSACTIONS } from '@/mocks/transactions.ts';
import { CHANNEL_ACCOUNTS, CHANNEL_TRANSACTIONS } from '@/services/accounts-service.ts';
import './home-page.ts';

const meta: Meta = {
  title: 'Pages/HomePage',
  component: 'home-page',
  decorators: [withCellsBridge],
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Dashboard principal. Usa **inbounds declarativos** (opción B) con dos canales:

- \`bk:accounts\` → propiedad \`this.accounts\`
- \`bk:transactions\` → propiedad \`this.recentTransactions\` con \`action\`
  que filtra y limita a 5 las transacciones de la cuenta principal.

El \`action\` en un inbound permite transformar el dato antes de guardarlo.
        `,
      },
    },
  },
};
export default meta;

/** Dispara la action interna de un inbound con datos mock. */
function fireInbound(el: any, channelName: string, value: unknown) {
  const sub = el._pageController.subscriptions.find(
    (s: { channel: string }) => s.channel === channelName,
  );
  sub?.action(value);
}

// ─── Default (datos cargados) ──────────────────────────────────────────────────

export const Default: StoryObj = {
  name: 'Default',
  render: () => html`<home-page></home-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('home-page') as any;
    if (!el) return;
    await el.updateComplete;

    el._pageController.navigate = fn().mockName('navigate');
    sessionStorage.setItem('bk-user', JSON.stringify({ name: 'Ana García', email: 'demo@bank.es', role: 'regular' }));

    fireInbound(el, CHANNEL_ACCOUNTS, ACCOUNTS);
    fireInbound(el, CHANNEL_TRANSACTIONS, TRANSACTIONS);
  },
};

// ─── Loading (sin datos aún) ───────────────────────────────────────────────────

export const Loading: StoryObj = {
  name: 'Loading',
  render: () => html`<home-page></home-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('home-page') as any;
    if (!el) return;
    await el.updateComplete;

    el._pageController.navigate = fn().mockName('navigate');
    sessionStorage.setItem('bk-user', JSON.stringify({ name: 'Ana García', email: 'demo@bank.es', role: 'regular' }));
    // Sin fireInbound → accounts y recentTransactions = undefined → estado loading
  },
};
