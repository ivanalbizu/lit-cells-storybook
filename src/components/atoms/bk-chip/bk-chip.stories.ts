import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-chip.ts';

const meta: Meta = {
  title: 'Atoms/BkChip',
  component: 'bk-chip',
  argTypes: {
    label:    { control: 'text' },
    value:    { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Alimentación', value: 'food', selected: false, disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ label, value, selected, disabled }) =>
    html`<bk-chip label=${label} value=${value} ?selected=${selected} ?disabled=${disabled}></bk-chip>`,
};

export const Selected: Story = {
  args: { selected: true, label: 'Transferencias' },
  render: ({ label, value, selected, disabled }) =>
    html`<bk-chip label=${label} value=${value} ?selected=${selected} ?disabled=${disabled}></bk-chip>`,
};

export const Disabled: Story = {
  args: { disabled: true, label: 'No disponible' },
  render: ({ label, value, selected, disabled }) =>
    html`<bk-chip label=${label} value=${value} ?selected=${selected} ?disabled=${disabled}></bk-chip>`,
};

export const FilterGroup: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <bk-chip label="Todos" value="all" selected></bk-chip>
      <bk-chip label="Alimentación" value="food"></bk-chip>
      <bk-chip label="Transporte" value="transport"></bk-chip>
      <bk-chip label="Ocio" value="leisure"></bk-chip>
      <bk-chip label="Transferencias" value="transfer"></bk-chip>
    </div>
  `,
};
