import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { fn } from 'storybook/test';
import { withCellsBridge } from '../../../.storybook/cells-decorator.ts';
import { ACCOUNTS } from '@/mocks/accounts.ts';
import { TRANSACTIONS } from '@/mocks/transactions.ts';
import { CHANNEL_ACCOUNTS, CHANNEL_TRANSACTIONS } from '@/services/accounts-service.ts';
import './account-detail-page.ts';

const meta: Meta = {
  title: 'Pages/AccountDetailPage',
  component: 'account-detail-page',
  decorators: [withCellsBridge],
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Detalle de una cuenta. Recibe el \`id\` como parámetro de ruta y filtra los
datos de los canales \`bk:accounts\` y \`bk:transactions\`.

El canal es un \`ReplaySubject(1)\`: en producción el servicio ya habrá
publicado los datos antes de que la página se monte, por lo que el callback
se invoca inmediatamente al suscribirse.
        `,
      },
    },
  },
};
export default meta;

/** Genera un mock de subscribe que entrega los datos brutos al callback. */
function mockSubscribeWithData() {
  return fn()
    .mockName('subscribe')
    .mockImplementation((channel: string, cb: (data: unknown) => void) => {
      if (channel === CHANNEL_ACCOUNTS) cb(ACCOUNTS);
      if (channel === CHANNEL_TRANSACTIONS) cb(TRANSACTIONS);
    });
}

// ─── Default — cuenta Nómina (acc-001) ────────────────────────────────────────

export const Default: StoryObj = {
  name: 'Default',
  render: () => html`<account-detail-page></account-detail-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('account-detail-page') as any;
    if (!el) return;
    await el.updateComplete;

    el._pageController.navigate = fn().mockName('navigate');
    el._pageController.subscribe = mockSubscribeWithData();
    el.onPageEnter({ id: 'acc-001' });
  },
};

// ─── Cuenta de Ahorro (acc-002) ────────────────────────────────────────────────

export const SavingsAccount: StoryObj = {
  name: 'SavingsAccount',
  render: () => html`<account-detail-page></account-detail-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('account-detail-page') as any;
    if (!el) return;
    await el.updateComplete;

    el._pageController.navigate = fn().mockName('navigate');
    el._pageController.subscribe = mockSubscribeWithData();
    el.onPageEnter({ id: 'acc-002' });
  },
};

// ─── Loading ──────────────────────────────────────────────────────────────────

export const Loading: StoryObj = {
  name: 'Loading',
  render: () => html`<account-detail-page></account-detail-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('account-detail-page') as any;
    if (!el) return;
    await el.updateComplete;

    el._pageController.navigate = fn().mockName('navigate');
    // subscribe silencioso → los canales no entregan datos → estado de carga
    el._pageController.subscribe = fn().mockName('subscribe');
    el.onPageEnter({ id: 'acc-001' });
  },
};

// ─── NotFound ─────────────────────────────────────────────────────────────────

export const NotFound: StoryObj = {
  name: 'NotFound',
  render: () => html`<account-detail-page></account-detail-page>`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('account-detail-page') as any;
    if (!el) return;
    await el.updateComplete;

    el._pageController.navigate = fn().mockName('navigate');
    el._pageController.subscribe = mockSubscribeWithData();
    // ID inexistente → account = null → muestra "Cuenta no encontrada"
    el.onPageEnter({ id: 'cuenta-inexistente' });
  },
};
