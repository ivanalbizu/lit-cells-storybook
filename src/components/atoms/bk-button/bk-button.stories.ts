import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-button.ts';

const meta: Meta = {
  title: 'Atoms/BkButton',
  component: 'bk-button',
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    type:    { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    loading:  { control: 'boolean' },
    href:     { control: 'text' },
    label:    { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `Botón polimórfico del sistema. Renderiza \`<button>\` por defecto; si recibe \`href\`, renderiza un \`<a>\` semántico navegable.

**Variantes**: \`primary\` · \`secondary\` · \`ghost\` · \`danger\`

**Como botón**: soporta \`type="submit"\` y \`type="reset"\` para integrarse con formularios nativos sin JavaScript adicional.

**Como enlace**: elimina el \`href\` del DOM cuando está deshabilitado y añade \`aria-disabled="true"\` para accesibilidad.`,
      },
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    href: '',
    disabled: false,
    loading: false,
    label: 'Transferir',
  },
};
export default meta;

type Story = StoryObj & { args?: { label?: string } };

const tpl = ({ variant, size, type, href, disabled, loading, label }: Record<string, unknown>) =>
  html`<bk-button
    variant=${variant}
    size=${size}
    type=${type}
    href=${href || ''}
    ?disabled=${disabled}
    ?loading=${loading}
  >${label}</bk-button>`;

export const Default: Story   = { render: tpl };
export const Primary: Story   = { args: { variant: 'primary',   label: 'Transferir' },      render: tpl };
export const Secondary: Story = { args: { variant: 'secondary', label: 'Ver detalle' },      render: tpl };
export const Ghost: Story     = { args: { variant: 'ghost',     label: 'Cancelar' },         render: tpl };
export const Danger: Story    = { args: { variant: 'danger',    label: 'Eliminar cuenta' },  render: tpl };
export const Disabled: Story  = { args: { disabled: true,       label: 'No disponible' },    render: tpl };
export const Loading: Story   = { args: { loading: true,        label: 'Procesando...' },    render: tpl };

export const AsLink: Story = {
  name: 'As link (href)',
  args: { href: 'https://example.com', label: 'Abrir documentación' },
  render: tpl,
};

export const AsLinkDisabled: Story = {
  name: 'As link — disabled',
  args: { href: 'https://example.com', disabled: true, label: 'Enlace deshabilitado' },
  render: tpl,
};

export const AsSubmit: Story = {
  name: 'As submit (inside form)',
  args: { type: 'submit', label: 'Enviar formulario' },
  render: ({ variant, size, label }) => html`
    <form @submit=${(e: Event) => { e.preventDefault(); alert('submit!'); }}>
      <bk-button variant=${variant} size=${size} type="submit">${label}</bk-button>
    </form>
  `,
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
