import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-card.ts';

const meta: Meta = {
  title: 'Molecules/BkCard',
  component: 'bk-card',
  argTypes: {
    elevated:    { control: 'boolean' },
    interactive: { control: 'boolean' },
  },
  args: { elevated: false, interactive: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ elevated, interactive }) => html`
    <bk-card ?elevated=${elevated} ?interactive=${interactive}>
      <p style="margin:0;font-family:system-ui">Contenido de la tarjeta</p>
    </bk-card>
  `,
};

export const Elevated: Story = {
  args: { elevated: true },
  render: ({ elevated, interactive }) => html`
    <bk-card ?elevated=${elevated} ?interactive=${interactive}>
      <p style="margin:0;font-family:system-ui">Tarjeta con sombra elevada</p>
    </bk-card>
  `,
};

export const Interactive: Story = {
  args: { interactive: true },
  render: ({ elevated, interactive }) => html`
    <bk-card ?elevated=${elevated} ?interactive=${interactive}>
      <p style="margin:0;font-family:system-ui">Pasa el cursor por encima</p>
    </bk-card>
  `,
};
