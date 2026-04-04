import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-transaction-list.ts';
import type { Transaction } from './bk-transaction-list.ts';

const TRANSACTIONS: Transaction[] = [
  { id: '1', concept: 'Nómina abril',          date: '01/04/2026', category: 'transfer',  amount:  2350.00, status: 'completed' },
  { id: '2', concept: 'Supermercado Mercadona', date: '01/04/2026', category: 'food',      amount:   -67.40, status: 'completed' },
  { id: '3', concept: 'Metro mensual',          date: '31/03/2026', category: 'transport', amount:   -54.60, status: 'completed' },
  { id: '4', concept: 'Netflix',                date: '30/03/2026', category: 'leisure',   amount:   -15.99, status: 'completed' },
  { id: '5', concept: 'Transferencia a Pedro',  date: '29/03/2026', category: 'transfer',  amount:  -300.00, status: 'pending'   },
  { id: '6', concept: 'Farmacia',               date: '28/03/2026', category: 'health',    amount:   -23.50, status: 'completed' },
  { id: '7', concept: 'Luz y gas',              date: '27/03/2026', category: 'utilities', amount:   -89.00, status: 'failed'    },
];

const meta: Meta = {
  title: 'Organisms/BkTransactionList',
  component: 'bk-transaction-list',
  argTypes: {
    loading:      { control: 'boolean' },
    emptyMessage: { control: 'text' },
  },
  args: {
    loading: false,
    emptyMessage: 'No hay movimientos para mostrar.',
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ loading, emptyMessage }) => html`
    <div style="max-width:520px;padding:1rem">
      <bk-transaction-list
        .transactions=${TRANSACTIONS}
        ?loading=${loading}
        emptyMessage=${emptyMessage}
      ></bk-transaction-list>
    </div>
  `,
};

export const Loading: Story = {
  args: { loading: true },
  render: ({ loading, emptyMessage }) => html`
    <div style="max-width:520px;padding:1rem">
      <bk-transaction-list
        .transactions=${TRANSACTIONS}
        ?loading=${loading}
        emptyMessage=${emptyMessage}
      ></bk-transaction-list>
    </div>
  `,
};

export const Empty: Story = {
  render: ({ loading, emptyMessage }) => html`
    <div style="max-width:520px;padding:1rem">
      <bk-transaction-list
        .transactions=${[]}
        ?loading=${loading}
        emptyMessage=${emptyMessage}
      ></bk-transaction-list>
    </div>
  `,
};
