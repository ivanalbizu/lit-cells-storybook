import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './bk-header.ts';
import type { NavItem } from './bk-header.ts';

const NAV: NavItem[] = [
  { label: 'Inicio',     route: 'home' },
  { label: 'Cuentas',    route: 'accounts' },
  { label: 'Transferir', route: 'transfer' },
];

const meta: Meta = {
  title: 'Organisms/BkHeader',
  component: 'bk-header',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    appName:     { control: 'text' },
    userName:    { control: 'text' },
    activeRoute: { control: 'select', options: ['home', 'accounts', 'transfer', ''] },
  },
  args: {
    appName:     'BankApp',
    userName:    'Ana García',
    activeRoute: 'home',
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: ({ appName, userName, activeRoute }) => html`
    <bk-header
      appName=${appName}
      userName=${userName}
      activeRoute=${activeRoute}
      .navItems=${NAV}
    ></bk-header>
  `,
};

export const NoUser: Story = {
  args: { userName: '' },
  render: ({ appName, userName, activeRoute }) => html`
    <bk-header
      appName=${appName}
      userName=${userName}
      activeRoute=${activeRoute}
      .navItems=${NAV}
    ></bk-header>
  `,
};

export const NoNav: Story = {
  render: ({ appName, userName }) => html`
    <bk-header
      appName=${appName}
      userName=${userName}
      activeRoute=""
      .navItems=${[]}
    ></bk-header>
  `,
};

export const TransferActive: Story = {
  args: { activeRoute: 'transfer' },
  render: ({ appName, userName, activeRoute }) => html`
    <bk-header
      appName=${appName}
      userName=${userName}
      activeRoute=${activeRoute}
      .navItems=${NAV}
    ></bk-header>
  `,
};
