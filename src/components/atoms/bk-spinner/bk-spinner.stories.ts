import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-spinner.ts';

const meta: Meta = {
  title: 'Atoms/BkSpinner',
  component: 'bk-spinner',
  argTypes: {
    size:  { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Indicador de carga accesible. El `label` se expone como `aria-label` para lectores de pantalla — siempre debe tener un valor descriptivo del contexto (ej. "Cargando cuentas...").',
      },
    },
  },
  args: { size: 'md', label: 'Cargando...' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ size, label }) => html`<bk-spinner size=${size} label=${label}></bk-spinner>`,
};

export const Loading: Story = {
  args: { size: 'lg', label: 'Procesando transferencia...' },
  render: ({ size, label }) => html`<bk-spinner size=${size} label=${label}></bk-spinner>`,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:1.5rem">
      <bk-spinner size="sm"></bk-spinner>
      <bk-spinner size="md"></bk-spinner>
      <bk-spinner size="lg"></bk-spinner>
    </div>
  `,
};
