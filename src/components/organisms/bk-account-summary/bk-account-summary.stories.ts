import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-account-summary.ts';

const meta: Meta = {
  title: 'Organisms/BkAccountSummary',
  component: 'bk-account-summary',
  argTypes: {
    alias:    { control: 'text' },
    iban:     { control: 'text' },
    balance:  { control: 'number' },
    currency: { control: 'select', options: ['EUR', 'USD', 'GBP'] },
    loading:  { control: 'boolean' },
  },
  args: {
    alias:   'Cuenta Nómina',
    iban:    'ES12 3456 7890 1234 5678 9012',
    balance: 4250.80,
    currency: 'EUR',
    loading: false,
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ alias, iban, balance, currency, loading }) => html`
    <div style="max-width:360px;padding:1rem">
      <bk-account-summary
        alias=${alias} iban=${iban} .balance=${balance}
        currency=${currency} ?loading=${loading}
      ></bk-account-summary>
    </div>
  `,
};

export const Loading: Story = {
  args: { loading: true },
  render: ({ alias, iban, balance, currency, loading }) => html`
    <div style="max-width:360px;padding:1rem">
      <bk-account-summary
        alias=${alias} iban=${iban} .balance=${balance}
        currency=${currency} ?loading=${loading}
      ></bk-account-summary>
    </div>
  `,
};

export const NegativeBalance: Story = {
  args: { alias: 'Cuenta Crédito', balance: -1230.50 },
  render: ({ alias, iban, balance, currency, loading }) => html`
    <div style="max-width:360px;padding:1rem">
      <bk-account-summary
        alias=${alias} iban=${iban} .balance=${balance}
        currency=${currency} ?loading=${loading}
      ></bk-account-summary>
    </div>
  `,
};
