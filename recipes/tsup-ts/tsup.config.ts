import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  splitting: false,

  // This custom tsconfig doesn't appear to be respected by tsup.
  // Manually defining `target`, `sourcemap`, and `dts` compiler options.
  tsconfig: './tsconfig.json',
  target: ['es2021'], // Node.js 16
  sourcemap: true,
  dts: true,
})
