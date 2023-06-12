import esbuild from 'esbuild'

// https://esbuild.github.io/api/#platform
// https://esbuild.github.io/api/#format

const common = {
  entryPoints: ['src/index.ts'],
  sourcemap: true,
  target: [
    'es2021',
    'chrome58',
    'edge16',
    'firefox57',
    'ie11',
    'ios10',
    'node16',
    'opera45',
    'safari11',
  ],
}

await esbuild.build({
  ...common,
  platform: 'node',
  format: 'cjs',
  outdir: 'dist/cjs',
})

await esbuild.build({
  ...common,
  platform: 'neutral',
  format: 'esm',
  outdir: 'dist/esm',
  outExtension: { '.js': '.mjs' },
})

await esbuild.build({
  ...common,
  platform: 'browser',
  format: 'iife',
  outdir: 'dist/browser',
  bundle: true,
})
