import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: [
    'commander',
    'inquirer',
    'ora',
    'chalk',
    'picocolors',
    'dotenv',
  ],
  esbuildOptions(options) {
    options.alias = {
      '@appTypes': './src/types/index.ts',
      '@utils': './src/utils/index.ts',
      '@shared': './src/shared/index.ts',
    }
  },
})
