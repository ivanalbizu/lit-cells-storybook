import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-amount.ts';

const meta: Meta = {
  title: 'Atoms/BkAmount',
  component: 'bk-amount',
  argTypes: {
    value:    { control: 'number' },
    currency: { control: 'select', options: ['EUR', 'USD', 'GBP'] },
    locale:   { control: 'select', options: ['es-ES', 'en-US', 'de-DE'] },
    colorize: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `Formatea un importe numérico con divisa y locale usando \`Intl.NumberFormat\`.

Con \`colorize\` activo, los importes positivos se muestran en verde (\`--bk-color-success\`) y los negativos en rojo (\`--bk-color-danger\`). Con \`colorize=false\` usa siempre el color de texto neutro.`,
      },
    },
  },
  args: { value: 1500.50, currency: 'EUR', locale: 'es-ES', colorize: true },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ value, currency, locale, colorize }) =>
    html`<bk-amount .value=${value} currency=${currency} locale=${locale} ?colorize=${colorize}></bk-amount>`,
};

export const Positive: Story = {
  args: { value: 2340.00 },
  render: ({ value, currency, locale, colorize }) =>
    html`<bk-amount .value=${value} currency=${currency} locale=${locale} ?colorize=${colorize}></bk-amount>`,
};

export const Negative: Story = {
  args: { value: -89.95 },
  render: ({ value, currency, locale, colorize }) =>
    html`<bk-amount .value=${value} currency=${currency} locale=${locale} ?colorize=${colorize}></bk-amount>`,
};

export const Zero: Story = {
  args: { value: 0 },
  render: ({ value, currency, locale, colorize }) =>
    html`<bk-amount .value=${value} currency=${currency} locale=${locale} ?colorize=${colorize}></bk-amount>`,
};

export const WithoutColorize: Story = {
  args: { value: -200, colorize: false },
  render: ({ value, currency, locale, colorize }) =>
    html`<bk-amount .value=${value} currency=${currency} locale=${locale} ?colorize=${colorize}></bk-amount>`,
};

export const DifferentCurrencies: Story = {
  render: () => html`
    <div style="display:flex;gap:1.5rem;font-size:1.25rem">
      <bk-amount .value=${1200} currency="EUR" locale="es-ES"></bk-amount>
      <bk-amount .value=${1200} currency="USD" locale="en-US"></bk-amount>
      <bk-amount .value=${1200} currency="GBP" locale="de-DE"></bk-amount>
    </div>
  `,
};
