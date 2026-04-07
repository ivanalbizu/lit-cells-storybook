import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-alert.ts';

const meta: Meta = {
  title: 'Molecules/BkAlert',
  component: 'bk-alert',
  argTypes: {
    type:        { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    message:     { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `Mensaje de notificación con icono contextual. Cuatro tipos semánticos: \`info\`, \`success\`, \`warning\`, \`error\`.

Con \`dismissible\` activo muestra un botón de cierre que emite \`bk-alert-dismiss\` y oculta el componente. Usado en páginas para feedback de operaciones (login, transferencias).`,
      },
    },
  },
  args: {
    type: 'info',
    message: 'La transferencia será procesada en 1-2 días hábiles.',
    dismissible: false,
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ type, message, dismissible }) =>
    html`<bk-alert type=${type} message=${message} ?dismissible=${dismissible}></bk-alert>`,
};

export const Info: Story = {
  args: { type: 'info', message: 'Recuerda que las transferencias internacionales tienen comisión.' },
  render: ({ type, message, dismissible }) =>
    html`<bk-alert type=${type} message=${message} ?dismissible=${dismissible}></bk-alert>`,
};

export const Success: Story = {
  args: { type: 'success', message: 'Transferencia realizada correctamente.' },
  render: ({ type, message, dismissible }) =>
    html`<bk-alert type=${type} message=${message} ?dismissible=${dismissible}></bk-alert>`,
};

export const Warning: Story = {
  args: { type: 'warning', message: 'Saldo insuficiente para completar la operación.' },
  render: ({ type, message, dismissible }) =>
    html`<bk-alert type=${type} message=${message} ?dismissible=${dismissible}></bk-alert>`,
};

export const Error: Story = {
  args: { type: 'error', message: 'No se pudo conectar con el servidor. Inténtalo de nuevo.' },
  render: ({ type, message, dismissible }) =>
    html`<bk-alert type=${type} message=${message} ?dismissible=${dismissible}></bk-alert>`,
};

export const Dismissible: Story = {
  args: { type: 'info', message: 'Puedes cerrar este aviso.', dismissible: true },
  render: ({ type, message, dismissible }) =>
    html`<bk-alert type=${type} message=${message} ?dismissible=${dismissible}></bk-alert>`,
};

export const AllTypes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:0.75rem;max-width:480px">
      <bk-alert type="info"    message="Información general del sistema."></bk-alert>
      <bk-alert type="success" message="Operación completada con éxito."></bk-alert>
      <bk-alert type="warning" message="Revisa los datos antes de continuar."></bk-alert>
      <bk-alert type="error"   message="Se produjo un error inesperado."></bk-alert>
    </div>
  `,
};
