import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-designs",
    "storybook-addon-pseudo-states",
  ],
  framework: "@storybook/react-vite",
  viteFinal(config) {
    config.plugins ??= [];
    config.plugins.push(tailwindcss());
    // Read the workspace packages from their TypeScript source (their `source` export
    // condition), so an edit shows up without building the package first.
    // Setting the list replaces Vite's own, so its client defaults are repeated after `source`.
    config.resolve = { ...config.resolve, conditions: ["source", "module", "browser", "development|production"] };
    return config;
  },
};

export default config;
