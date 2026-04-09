import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-transaction-item.ts';

const meta: Meta = {
  title: 'Molecules/BkTransactionItem',
  component: 'bk-transaction-item',
  argTypes: {
    loading:  { control: 'boolean' },
    concept:  { control: 'text' },
    date:     { control: 'text' },
    category: { control: 'select', options: ['food', 'transport', 'leisure', 'transfer', 'health', 'utilities', ''] },
    amount:   { control: 'number' },
    currency: { control: 'select', options: ['EUR', 'USD'] },
    status:   { control: 'select', options: ['pending', 'completed', 'failed'] },
  },
  parameters: {
    docs: {
      description: {
        component: `Fila de movimiento bancario. Combina concepto, fecha, categoría (\`bk-chip\` en modo display), importe (\`bk-amount\`) y estado (\`bk-badge\`).

El importe usa \`colorize\` automáticamente: positivos en verde, negativos en rojo. Sin \`category\`, no renderiza el chip.`,
      },
    },
  },
  args: {
    concept: 'Supermercado Mercadona',
    date: '02/04/2026',
    category: 'food',
    amount: -67.40,
    currency: 'EUR',
    status: 'completed',
  },
};
export default meta;

type Story = StoryObj;

export const Loading: Story = {
  args: { loading: true },
  render: () => html`
    <div style="max-width:480px;padding:0 1rem">
      <bk-transaction-item loading></bk-transaction-item>
      <bk-transaction-item loading></bk-transaction-item>
      <bk-transaction-item loading></bk-transaction-item>
    </div>
  `,
};

export const Default: Story = {
  render: ({ concept, date, category, amount, currency, status }) =>
    html`<div style="max-width:480px;padding:0 1rem">
      <bk-transaction-item concept=${concept} date=${date} category=${category}
        .amount=${amount} currency=${currency} status=${status}></bk-transaction-item>
    </div>`,
};

export const Incoming: Story = {
  args: { concept: 'Nómina abril', date: '01/04/2026', category: 'transfer', amount: 2350.00, status: 'completed' },
  render: ({ concept, date, category, amount, currency, status }) =>
    html`<div style="max-width:480px;padding:0 1rem">
      <bk-transaction-item concept=${concept} date=${date} category=${category}
        .amount=${amount} currency=${currency} status=${status}></bk-transaction-item>
    </div>`,
};

export const Pending: Story = {
  args: { concept: 'Transferencia a Juan', date: '02/04/2026', category: 'transfer', amount: -200.00, status: 'pending' },
  render: ({ concept, date, category, amount, currency, status }) =>
    html`<div style="max-width:480px;padding:0 1rem">
      <bk-transaction-item concept=${concept} date=${date} category=${category}
        .amount=${amount} currency=${currency} status=${status}></bk-transaction-item>
    </div>`,
};

export const Failed: Story = {
  args: { concept: 'Pago rechazado', date: '01/04/2026', category: '', amount: -150.00, status: 'failed' },
  render: ({ concept, date, category, amount, currency, status }) =>
    html`<div style="max-width:480px;padding:0 1rem">
      <bk-transaction-item concept=${concept} date=${date} category=${category}
        .amount=${amount} currency=${currency} status=${status}></bk-transaction-item>
    </div>`,
};

export const List: Story = {
  render: () => html`
    <div style="max-width:480px;padding:0 1rem">
      <bk-transaction-item concept="Nómina abril"         date="01/04/2026" category="transfer"  .amount=${2350.00}  status="completed"></bk-transaction-item>
      <bk-transaction-item concept="Supermercado"         date="01/04/2026" category="food"      .amount=${-67.40}   status="completed"></bk-transaction-item>
      <bk-transaction-item concept="Metro mensual"        date="31/03/2026" category="transport" .amount=${-54.60}   status="completed"></bk-transaction-item>
      <bk-transaction-item concept="Netflix"              date="30/03/2026" category="leisure"   .amount=${-15.99}   status="completed"></bk-transaction-item>
      <bk-transaction-item concept="Transferencia Pedro"  date="29/03/2026" category="transfer"  .amount=${-300.00}  status="pending"></bk-transaction-item>
      <bk-transaction-item concept="Pago rechazado"       date="28/03/2026" category=""          .amount=${-89.00}   status="failed"></bk-transaction-item>
    </div>
  `,
};
