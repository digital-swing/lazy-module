import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import globImport, { camelCase } from 'rollup-plugin-glob-import';
// import globImport from 'rollup-plugin-glob-import';
import pkg from './package.json' assert { type: 'json' };
import renameNodeModules from 'rollup-plugin-rename-node-modules';
// import summary from 'rollup-plugin-summary';
// import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    external: ['intersection-observer', 'requestidlecallback-polyfill'],
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
        // plugins: [terser()],
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs({
        include: /node_modules/,
      }),
      typescript({ sourceMap: true }),
      renameNodeModules('external'),
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: {
      file: `dist/types/index.d.ts`,
      format: 'es',
    },
  },
];
