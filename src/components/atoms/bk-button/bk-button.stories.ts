import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-button.ts';

const meta: Meta = {
  title: 'Atoms/BkButton',
  component: 'bk-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading:  { control: 'boolean' },
    label:    { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    label: 'Transferir',
  },
};
export default meta;

type Story = StoryObj & { args?: { label?: string } };

export const Default: Story = {
  render: ({ variant, size, disabled, loading, label }) =>
    html`<bk-button variant=${variant} size=${size} ?disabled=${disabled} ?loading=${loading}>${label}</bk-button>`,
};

export const Primary: Story = {
  args: { variant: 'primary', label: 'Transferir' },
  render: ({ variant, size, disabled, loading, label }) =>
    html`<bk-button variant=${variant} size=${size} ?disabled=${disabled} ?loading=${loading}>${label}</bk-button>`,
};

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Ver detalle' },
  render: ({ variant, size, disabled, loading, label }) =>
    html`<bk-button variant=${variant} size=${size} ?disabled=${disabled} ?loading=${loading}>${label}</bk-button>`,
};

export const Ghost: Story = {
  args: { variant: 'ghost', label: 'Cancelar' },
  render: ({ variant, size, disabled, loading, label }) =>
    html`<bk-button variant=${variant} size=${size} ?disabled=${disabled} ?loading=${loading}>${label}</bk-button>`,
};

export const Danger: Story = {
  args: { variant: 'danger', label: 'Eliminar cuenta' },
  render: ({ variant, size, disabled, loading, label }) =>
    html`<bk-button variant=${variant} size=${size} ?disabled=${disabled} ?loading=${loading}>${label}</bk-button>`,
};

export const Disabled: Story = {
  args: { disabled: true, label: "No disponible " },
  render: ({ variant, size, disabled, loading, label }) =>
    html`<bk-button variant=${variant} size=${size} ?disabled=${disabled} ?loading=${loading}>${label}</bk-button>`,
};

export const Loading: Story = {
  args: { loading: true, label: 'Procesando...' },
  render: ({ variant, size, disabled, loading, label }) =>
    html`<bk-button variant=${variant} size=${size} ?disabled=${disabled} ?loading=${loading}>${label}</bk-button>`,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
      <bk-button size="sm">Pequeño</bk-button>
      <bk-button size="md">Mediano</bk-button>
      <bk-button size="lg">Grande</bk-button>
    </div>
  `,
};
