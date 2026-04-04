// .storybook/main.ts
import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  async viteFinal(config) {
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      "@open-cells/core",
      "@open-cells/page-controller",
      "lit",
    ];
    return config;
  },
};

export default config;
