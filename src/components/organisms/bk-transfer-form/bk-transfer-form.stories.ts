import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-transfer-form.ts';

const meta: Meta = {
  title: 'Organisms/BkTransferForm',
  component: 'bk-transfer-form',
  argTypes: {
    heading:        { control: 'text' },
    headingTag:     { control: 'select', options: ['h1','h2','h3','h4','h5','h6','div','p'] },
    loading:        { control: 'boolean' },
    successMessage: { control: 'text' },
    errorMessage:   { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `Formulario de transferencia con validación. Campos: IBAN destino, importe y concepto.

El título es configurable: \`heading\` controla el texto y \`headingTag\` el elemento HTML (h1–h6, div, p). El tag se valida contra una lista blanca — cualquier valor no reconocido cae a \`h3\`.

Emite \`bk-transfer-submit\` con \`{ iban, amount, concept }\` solo si la validación pasa. Emite \`bk-transfer-cancel\` al pulsar cancelar. Los mensajes de éxito/error los gestiona la página contenedora via \`successMessage\` y \`errorMessage\`.`,
      },
    },
  },
  args: {
    heading: 'Nueva transferencia',
    headingTag: 'h3',
    loading: false,
    successMessage: '',
    errorMessage: '',
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ heading, headingTag, loading, successMessage, errorMessage }) => html`
    <div>
      <bk-transfer-form
        heading=${heading}
        headingTag=${headingTag}
        ?loading=${loading}
        successMessage=${successMessage}
        errorMessage=${errorMessage}
      ></bk-transfer-form>
    </div>
  `,
};

export const Loading: Story = {
  args: { loading: true },
  render: ({ heading, headingTag, loading, successMessage, errorMessage }) => html`
    <div>
      <bk-transfer-form
        heading=${heading}
        headingTag=${headingTag}
        ?loading=${loading}
        successMessage=${successMessage}
        errorMessage=${errorMessage}
      ></bk-transfer-form>
    </div>
  `,
};

export const WithError: Story = {
  args: { errorMessage: 'No se pudo conectar con el servidor. Inténtalo de nuevo.' },
  render: ({ heading, headingTag, loading, successMessage, errorMessage }) => html`
    <div>
      <bk-transfer-form
        heading=${heading}
        headingTag=${headingTag}
        ?loading=${loading}
        successMessage=${successMessage}
        errorMessage=${errorMessage}
      ></bk-transfer-form>
    </div>
  `,
};

export const WithSuccess: Story = {
  args: { successMessage: 'Transferencia de 500,00 € enviada correctamente.' },
  render: ({ heading, headingTag, loading, successMessage, errorMessage }) => html`
    <div>
      <bk-transfer-form
        heading=${heading}
        headingTag=${headingTag}
        ?loading=${loading}
        successMessage=${successMessage}
        errorMessage=${errorMessage}
      ></bk-transfer-form>
    </div>
  `,
};

export const AsSection: Story = {
  args: { heading: 'Realizar transferencia', headingTag: 'h2' },
  render: ({ heading, headingTag, loading, successMessage, errorMessage }) => html`
    <div>
      <bk-transfer-form
        heading=${heading}
        headingTag=${headingTag}
        ?loading=${loading}
        successMessage=${successMessage}
        errorMessage=${errorMessage}
      ></bk-transfer-form>
    </div>
  `,
};
