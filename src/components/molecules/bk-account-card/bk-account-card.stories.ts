import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-account-card.ts';

const meta: Meta = {
  title: 'Molecules/BkAccountCard',
  component: 'bk-account-card',
  argTypes: {
    alias:    { control: 'text' },
    iban:     { control: 'text' },
    balance:  { control: 'number' },
    currency: { control: 'select', options: ['EUR', 'USD', 'GBP'] },
    loading:  { control: 'boolean' },
  },
  args: {
    alias: 'Cuenta Nómina',
    iban: 'ES12 3456 7890 1234 5678 9012',
    balance: 4250.80,
    currency: 'EUR',
    loading: false,
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ alias, iban, balance, currency, loading }) =>
    html`<bk-account-card alias=${alias} iban=${iban} .balance=${balance}
      currency=${currency} ?loading=${loading}></bk-account-card>`,
};

export const Loading: Story = {
  args: { loading: true },
  render: ({ alias, iban, balance, currency, loading }) =>
    html`<bk-account-card alias=${alias} iban=${iban} .balance=${balance}
      currency=${currency} ?loading=${loading}></bk-account-card>`,
};

export const NegativeBalance: Story = {
  args: { alias: 'Cuenta Crédito', balance: -1230.50 },
  render: ({ alias, iban, balance, currency, loading }) =>
    html`<bk-account-card alias=${alias} iban=${iban} .balance=${balance}
      currency=${currency} ?loading=${loading}></bk-account-card>`,
};

export const MultipleAccounts: Story = {
  render: () => html`
    <div style="display:flex;gap:1.5rem;flex-wrap:wrap">
      <bk-account-card alias="Cuenta Nómina" iban="ES12 3456 7890 1234 5678 9012" .balance=${4250.80} currency="EUR"></bk-account-card>
      <bk-account-card alias="Cuenta Ahorro"  iban="ES98 7654 3210 9876 5432 1098" .balance=${12000.00} currency="EUR"></bk-account-card>
      <bk-account-card alias="Cuenta Crédito" iban="ES11 2233 4455 6677 8899 0011" .balance=${-450.20} currency="EUR"></bk-account-card>
    </div>
  `,
};
