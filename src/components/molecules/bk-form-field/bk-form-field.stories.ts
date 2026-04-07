import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-form-field.ts';

const meta: Meta = {
  title: 'Molecules/BkFormField',
  component: 'bk-form-field',
  argTypes: {
    type:        { control: 'select', options: ['text', 'number', 'password', 'email'] },
    label:       { control: 'text' },
    placeholder: { control: 'text' },
    value:       { control: 'text' },
    error:       { control: 'text' },
    hint:        { control: 'text' },
    required:    { control: 'boolean' },
    disabled:    { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `Campo de formulario accesible completo: label, \`bk-input\`, hint y mensaje de error vinculado via \`aria-describedby\`.

Diferencia con \`bk-input\`: \`bk-form-field\` es el bloque de construcción para formularios reales. \`bk-input\` es el elemento de entrada aislado, reutilizable en otros contextos.

Emite \`bk-field-input\` con \`{ name, value }\` en cada cambio.`,
      },
    },
  },
  args: {
    label: 'IBAN destino',
    name: 'iban',
    type: 'text',
    placeholder: 'ES00 0000 0000 0000 0000 0000',
    value: '',
    error: '',
    hint: '',
    required: false,
    disabled: false,
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ type, label, name, placeholder, value, error, hint, required, disabled }) =>
    html`<div style="max-width:400px">
      <bk-form-field type=${type} label=${label} name=${name} placeholder=${placeholder}
        value=${value} error=${error} hint=${hint} ?required=${required} ?disabled=${disabled}>
      </bk-form-field>
    </div>`,
};

export const WithHint: Story = {
  args: {
    label: 'Importe',
    name: 'amount',
    type: 'number',
    placeholder: '0,00',
    hint: 'Máximo 10.000 € por transferencia',
  },
  render: ({ type, label, name, placeholder, value, error, hint, required, disabled }) =>
    html`<div style="max-width:400px">
      <bk-form-field type=${type} label=${label} name=${name} placeholder=${placeholder}
        value=${value} error=${error} hint=${hint} ?required=${required} ?disabled=${disabled}>
      </bk-form-field>
    </div>`,
};

export const WithError: Story = {
  args: {
    label: 'Email',
    name: 'email',
    type: 'email',
    value: 'no-es-un-email',
    error: 'El formato del email no es válido',
  },
  render: ({ type, label, name, placeholder, value, error, hint, required, disabled }) =>
    html`<div style="max-width:400px">
      <bk-form-field type=${type} label=${label} name=${name} placeholder=${placeholder}
        value=${value} error=${error} hint=${hint} ?required=${required} ?disabled=${disabled}>
      </bk-form-field>
    </div>`,
};

export const Required: Story = {
  args: { label: 'Contraseña', name: 'password', type: 'password', required: true },
  render: ({ type, label, name, placeholder, value, error, hint, required, disabled }) =>
    html`<div style="max-width:400px">
      <bk-form-field type=${type} label=${label} name=${name} placeholder=${placeholder}
        value=${value} error=${error} hint=${hint} ?required=${required} ?disabled=${disabled}>
      </bk-form-field>
    </div>`,
};

export const Disabled: Story = {
  args: { label: 'Cuenta origen', name: 'account', value: 'ES12 3456 7890 1234', disabled: true },
  render: ({ type, label, name, placeholder, value, error, hint, required, disabled }) =>
    html`<div style="max-width:400px">
      <bk-form-field type=${type} label=${label} name=${name} placeholder=${placeholder}
        value=${value} error=${error} hint=${hint} ?required=${required} ?disabled=${disabled}>
      </bk-form-field>
    </div>`,
};
