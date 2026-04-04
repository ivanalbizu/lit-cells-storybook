import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-input.ts';

const meta: Meta = {
  title: 'Atoms/BkInput',
  component: 'bk-input',
  argTypes: {
    type:        { control: 'select', options: ['text', 'number', 'password', 'email'] },
    label:       { control: 'text' },
    placeholder: { control: 'text' },
    value:       { control: 'text' },
    error:       { control: 'text' },
    disabled:    { control: 'boolean' },
    required:    { control: 'boolean' },
  },
  args: {
    type: 'text',
    label: 'IBAN destino',
    placeholder: 'ES00 0000 0000 0000 0000 0000',
    value: '',
    error: '',
    disabled: false,
    required: false,
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ type, label, placeholder, value, error, disabled, required }) =>
    html`<bk-input
      type=${type} label=${label} placeholder=${placeholder}
      value=${value} error=${error} ?disabled=${disabled} ?required=${required}
      name="iban"
    ></bk-input>`,
};

export const WithValue: Story = {
  args: { label: 'Importe', type: 'number', value: '1500', placeholder: '0,00' },
  render: ({ type, label, placeholder, value, error, disabled, required }) =>
    html`<bk-input type=${type} label=${label} placeholder=${placeholder} value=${value} error=${error} ?disabled=${disabled} ?required=${required} name="amount"></bk-input>`,
};

export const WithError: Story = {
  args: { label: 'Email', type: 'email', value: 'no-es-email', error: 'El formato del email no es válido' },
  render: ({ type, label, placeholder, value, error, disabled, required }) =>
    html`<bk-input type=${type} label=${label} placeholder=${placeholder} value=${value} error=${error} ?disabled=${disabled} ?required=${required} name="email"></bk-input>`,
};

export const Password: Story = {
  args: { label: 'Contraseña', type: 'password', placeholder: '••••••••', required: true },
  render: ({ type, label, placeholder, value, error, disabled, required }) =>
    html`<bk-input type=${type} label=${label} placeholder=${placeholder} value=${value} error=${error} ?disabled=${disabled} ?required=${required} name="password"></bk-input>`,
};

export const Disabled: Story = {
  args: { label: 'Cuenta origen', value: 'ES12 3456 7890 1234', disabled: true },
  render: ({ type, label, placeholder, value, error, disabled, required }) =>
    html`<bk-input type=${type} label=${label} placeholder=${placeholder} value=${value} error=${error} ?disabled=${disabled} ?required=${required} name="account"></bk-input>`,
};
