/// <reference types="vite/client" />
import type { Preview, Decorator } from '@storybook/web-components-vite'
import { withActions } from 'storybook/actions/decorator';
import '../src/css/tokens.css';
import '../src/css/global.css';

const DARK_BG  = '#0f172a';
const LIGHT_BG = '#f4f6f9';

const withColorScheme: Decorator = (story, context) => {
  const raw = context.globals['backgrounds'];
  // Storybook 8 puede guardar el nombre ('dark') o el hex ('#0f172a')
  // dependiendo de la versión y configuración del addon
  const bg = (typeof raw === 'object' && raw !== null)
    ? String((raw as Record<string, unknown>).value ?? '')
    : String(raw ?? '');

  if (bg === 'dark' || bg === DARK_BG) {
    document.documentElement.dataset.theme = 'dark';
  } else if (bg === 'light' || bg === LIGHT_BG) {
    document.documentElement.dataset.theme = 'light';
  } else {
    delete document.documentElement.dataset.theme;
  }
  return story();
};

const preview: Preview = {
  decorators: [withColorScheme, withActions],
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light',  value: LIGHT_BG },
        { name: 'dark',   value: DARK_BG  },
        { name: 'system', value: 'transparent' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date:  /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;