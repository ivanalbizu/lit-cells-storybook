import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-badge.ts';

const meta: Meta = {
  title: 'Atoms/BkBadge',
  component: 'bk-badge',
  argTypes: {
    status: { control: 'select', options: ['pending', 'completed', 'failed'] },
  },
  args: { status: 'pending' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ status }) => html`<bk-badge status=${status}></bk-badge>`,
};

export const Pending: Story = {
  args: { status: 'pending' },
  render: ({ status }) => html`<bk-badge status=${status}></bk-badge>`,
};

export const Completed: Story = {
  args: { status: 'completed' },
  render: ({ status }) => html`<bk-badge status=${status}></bk-badge>`,
};

export const Failed: Story = {
  args: { status: 'failed' },
  render: ({ status }) => html`<bk-badge status=${status}></bk-badge>`,
};

export const AllStatuses: Story = {
  render: () => html`
    <div style="display:flex;gap:0.75rem;align-items:center">
      <bk-badge status="pending"></bk-badge>
      <bk-badge status="completed"></bk-badge>
      <bk-badge status="failed"></bk-badge>
    </div>
  `,
};
