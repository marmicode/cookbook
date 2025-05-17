import { mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mts';

export default mergeConfig(viteConfig, {
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/cookbook',
      provider: 'v8',
    },
    setupFiles: ['./test-setup.tsx'],
  },
});
