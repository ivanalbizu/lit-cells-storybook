import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-avatar.ts';

const meta: Meta = {
  title: 'Atoms/BkAvatar',
  component: 'bk-avatar',
  argTypes: {
    name: { control: 'text' },
    src:  { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { name: 'Ana García', src: '', size: 'md' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ name, src, size }) =>
    html`<bk-avatar name=${name} src=${src} size=${size}></bk-avatar>`,
};

export const WithInitials: Story = {
  args: { name: 'Carlos Martínez' },
  render: ({ name, src, size }) =>
    html`<bk-avatar name=${name} src=${src} size=${size}></bk-avatar>`,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:1rem">
      <bk-avatar name="Ana García" size="sm"></bk-avatar>
      <bk-avatar name="Ana García" size="md"></bk-avatar>
      <bk-avatar name="Ana García" size="lg"></bk-avatar>
    </div>
  `,
};

export const SingleName: Story = {
  args: { name: 'Pedro' },
  render: ({ name, src, size }) =>
    html`<bk-avatar name=${name} src=${src} size=${size}></bk-avatar>`,
};
