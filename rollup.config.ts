import dts from 'rollup-plugin-dts';

import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import globImport, { camelCase } from 'rollup-plugin-glob-import';
// import globImport from 'rollup-plugin-glob-import';
import pkg from './package.json' assert { type: 'json' };
// import summary from 'rollup-plugin-summary';
// import terser from '@rollup/plugin-terser';

const bundle = (config) => ({
  ...config,
  // external: (id) => !/^[./]/.test(id),
  external: Object.keys(pkg.peerDependencies),
  input: 'src/index.ts',
});

export default [
  bundle({
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name].cjs',
        exports: 'named',
        format: 'cjs',
        sourcemap: true,
      },
      {
        dir: 'dist',
        entryFileNames: '[name].mjs',
        exports: 'named',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
      },
      {
        exports: 'named',
        file: pkg.browser,
        format: 'umd',
        name: 'lazyModule',
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      esbuild({
        minify: true,
      }),
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `dist/types/index.d.ts`,
      format: 'es',
    },
  }),
];
