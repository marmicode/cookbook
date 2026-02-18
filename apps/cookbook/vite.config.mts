import path from 'node:path';
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

import { readdirSync } from 'node:fs';

const stubDir = path.resolve(__dirname, 'testing/theme-stub');
const stubAliases = Object.fromEntries(
  readdirSync(stubDir).map((file) => {
    const componentName = file.replace('.tsx', '');
    return [`@theme/${componentName}`, path.resolve(stubDir, componentName)];
  }),
);

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/cookbook',
  plugins: [nxViteTsPaths()],
  resolve: { alias: stubAliases },
});
