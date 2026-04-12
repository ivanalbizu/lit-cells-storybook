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
  parameters: {
    docs: {
      description: {
        component: `Campo de entrada accesible construido como **Form-Associated Custom Element**.

#### Accesibilidad y formularios nativos

Implementa \`static formAssociated = true\` y \`ElementInternals\`, lo que lo hace equivalente a un \`<input>\` nativo en cuanto a:

- **Asociación de label** — \`<label for="id">\` externo queda correctamente vinculado al campo en el árbol de accesibilidad. Screen readers (VoiceOver, NVDA, JAWS) anuncian el label sin configuración adicional.
- **Participación en formularios** — el valor se envía en \`form.submit()\` usando el atributo \`name\`, aparece en \`form.elements\` y responde a \`form.reset()\`.
- **Validación nativa** — expone \`ValidityState\` (\`:invalid\` / \`:valid\` CSS, \`form.checkValidity()\`). Soporta \`required\` y errores externos vía prop \`error\`.
- **\`<fieldset disabled>\`** — se deshabilita automáticamente cuando el formulario padre lo requiere.
- **Delegación de foco** — \`delegatesFocus: true\` garantiza que el click en un label externo enfoca el \`<input>\` interno del shadow DOM.

> **Nota sobre testers automáticos:** herramientas como axe o el panel a11y de Storybook pueden reportar un falso positivo en la asociación label/input porque analizan el DOM estático y no llegan al shadow DOM. En runtime el browser construye el árbol de accesibilidad correctamente. Ver \`docs/form-associated-element-internals.md\` para más detalle.

Para formularios con hint o layout avanzado usa \`bk-form-field\`, que envuelve este componente.

Emite \`bk-input-input\` y \`bk-input-change\` con \`{ value }\` en cada interacción.`,
      },
    },
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
