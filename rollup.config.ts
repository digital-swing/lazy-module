// import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import nodePolyfills from 'rollup-plugin-node-polyfills';
// import renameNodeModules from 'rollup-plugin-rename-node-modules';
import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';
export default [
  {
    input: 'src/index.ts',
    plugins: [esbuild()],
    output: {
      file: `dist/cjs/index.js`,
      format: 'cjs',
      sourcemap: true,
      // exports: 'default',
    },
    external: ['intersection-observer', 'requestidlecallback-polyfill'],
  },
  {
    input: 'src/index.ts',
    plugins: [esbuild(), resolve(), nodePolyfills(), summary()],
    output: {
      file: `dist/esm/index.js`,
      format: 'esm',
      sourcemap: true,
    },
    external: ['intersection-observer', 'requestidlecallback-polyfill'],
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: {
      file: `dist/types/index.d.ts`,
      format: 'es',
    },
  },
  // {
  //   input: 'src/index.ts',
  //   output: [
  //     {
  //       // exports: 'named',
  //       sourcemap: true,
  //       dir: 'dist/esm',
  //       // file: 'dist/esm/index.js',
  //       format: 'esm',
  //       preserveModules: true,
  //       preserveModulesRoot: 'src',
  //     },
  //     {
  //       // exports: 'named',
  //       sourcemap: true,
  //       file: 'dist/cjs/index.js',
  //       format: 'cjs',
  //     },
  //   ],
  // plugins: [
  //   resolve(),
  //   nodePolyfills(),
  //   commonjs({
  //     include: /node_modules/,
  //   }),
  //   summary(),
  //   renameNodeModules('external'),
  //   dts(),
  // ],
  // external: ['object-hash'],
  // },
  // plugins: [
  //   resolve(),
  //   nodePolyfills(),
  //   commonjs({
  //     include: /node_modules/,
  //   }),
  //   summary(),
  //   renameNodeModules('external'),
  //   dts(),
  // ],
  // external: ['object-hash'],
  // },
  // {
  //   // path to your declaration files root
  //   input: './dist/dts/index.d.ts',
  //   output: [{ file: 'types/index.d.ts', format: 'es' }],
  //   plugins: [dts()],
  // },
];
