import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-transfer-form.ts';

const meta: Meta = {
  title: 'Organisms/BkTransferForm',
  component: 'bk-transfer-form',
  argTypes: {
    loading:        { control: 'boolean' },
    successMessage: { control: 'text' },
    errorMessage:   { control: 'text' },
  },
  args: {
    loading: false,
    successMessage: '',
    errorMessage: '',
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ loading, successMessage, errorMessage }) => html`
    <div style="max-width:480px;padding:1.5rem">
      <bk-transfer-form
        ?loading=${loading}
        successMessage=${successMessage}
        errorMessage=${errorMessage}
      ></bk-transfer-form>
    </div>
  `,
};

export const Loading: Story = {
  args: { loading: true },
  render: ({ loading, successMessage, errorMessage }) => html`
    <div style="max-width:480px;padding:1.5rem">
      <bk-transfer-form
        ?loading=${loading}
        successMessage=${successMessage}
        errorMessage=${errorMessage}
      ></bk-transfer-form>
    </div>
  `,
};

export const WithError: Story = {
  args: { errorMessage: 'No se pudo conectar con el servidor. Inténtalo de nuevo.' },
  render: ({ loading, successMessage, errorMessage }) => html`
    <div style="max-width:480px;padding:1.5rem">
      <bk-transfer-form
        ?loading=${loading}
        successMessage=${successMessage}
        errorMessage=${errorMessage}
      ></bk-transfer-form>
    </div>
  `,
};

export const WithSuccess: Story = {
  args: { successMessage: 'Transferencia de 500,00 € enviada correctamente.' },
  render: ({ loading, successMessage, errorMessage }) => html`
    <div style="max-width:480px;padding:1.5rem">
      <bk-transfer-form
        ?loading=${loading}
        successMessage=${successMessage}
        errorMessage=${errorMessage}
      ></bk-transfer-form>
    </div>
  `,
};
