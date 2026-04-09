import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-skeleton.ts';

const meta: Meta = {
  title: 'Atoms/BkSkeleton',
  component: 'bk-skeleton',
  argTypes: {
    variant: { control: 'select', options: ['line', 'circle', 'rect'] },
    width:   { control: 'text' },
    height:  { control: 'text' },
  },
  args: { variant: 'line', width: '100%', height: '' },
  parameters: {
    docs: {
      description: {
        component: `Placeholder animado para estados de carga. Usa un shimmer horizontal que respeta los tokens \`--bk-color-border\` y \`--bk-color-surface\` — funciona automáticamente en dark mode.

**Variantes**: \`line\` (texto) · \`circle\` (avatar, icono) · \`rect\` (tarjeta, imagen)

Los colores del shimmer son sobreescribibles via:
\`--bk-skeleton-base\` y \`--bk-skeleton-shine\``,
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Line: Story = {
  args: { variant: 'line', width: '60%' },
  render: ({ variant, width, height }) =>
    html`<div style="max-width:400px;padding:1rem">
      <bk-skeleton variant=${variant} width=${width} height=${height}></bk-skeleton>
    </div>`,
};

export const Circle: Story = {
  args: { variant: 'circle', width: '3rem' },
  render: ({ variant, width }) =>
    html`<div style="padding:1rem">
      <bk-skeleton variant=${variant} width=${width}></bk-skeleton>
    </div>`,
};

export const Rect: Story = {
  args: { variant: 'rect', width: '100%', height: '120px' },
  render: ({ variant, width, height }) =>
    html`<div style="max-width:400px;padding:1rem">
      <bk-skeleton variant=${variant} width=${width} height=${height}></bk-skeleton>
    </div>`,
};

export const TransactionItemSkeleton: Story = {
  name: 'Composición — fila de transacción',
  render: () => html`
    <div style="max-width:480px;padding:1rem">
      ${[1, 2, 3].map(() => html`
        <div style="display:flex;align-items:center;gap:1rem;padding:1rem 0;border-bottom:1px solid #e5e7eb">
          <bk-skeleton variant="circle" width="2.5rem"></bk-skeleton>
          <div style="flex:1;display:flex;flex-direction:column;gap:0.375rem">
            <bk-skeleton variant="line" width="55%"></bk-skeleton>
            <bk-skeleton variant="line" width="35%" height="0.75rem"></bk-skeleton>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.375rem">
            <bk-skeleton variant="line" width="60px"></bk-skeleton>
            <bk-skeleton variant="line" width="50px" height="0.75rem"></bk-skeleton>
          </div>
        </div>
      `)}
    </div>
  `,
};

export const AccountCardSkeleton: Story = {
  name: 'Composición — tarjeta de cuenta',
  render: () => html`
    <div style="
      max-width:300px;padding:1.5rem;
      background:#003087;border-radius:12px;
      --bk-skeleton-base: rgba(255,255,255,0.15);
      --bk-skeleton-shine: rgba(255,255,255,0.35);
    ">
      <bk-skeleton variant="line" width="80px"  height="0.75rem" style="margin-bottom:1rem"></bk-skeleton>
      <bk-skeleton variant="line" width="140px" height="2rem"    style="margin-bottom:1rem"></bk-skeleton>
      <bk-skeleton variant="line" width="110px" height="0.6rem"></bk-skeleton>
    </div>
  `,
};
