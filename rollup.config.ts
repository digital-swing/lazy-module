import dts from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json' assert { type: 'json' };
import { RollupOptions } from 'rollup';

const bundle = (config: RollupOptions) => ({
  ...config,
  // external: (id) => !/^[./]/.test(id),
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
    ],
    plugins: [
      commonjs(),
      nodeResolve(),
      esbuild({
        minify: true,
      }),
    ],
  }),
  // bundle({
  //   plugins: [dts()],
  //   output: {
  //     file: `dist/types/index.d.ts`,
  //     format: 'es',
  //   },
  // }),
];
