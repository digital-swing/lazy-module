// import dts from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';
// import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
// import pkg from './package.json' assert { type: 'json' };
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import { RollupOptions } from 'rollup';
import mv from 'rollup-plugin-mv';

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
      del({ targets: ['./dist/*'] }),
      typescript({
        tsconfig: 'tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
      terser(),
      mv([{ src: './dist/src', dest: './dist/types' }], {
        overwrite: true,
        once: true,
      }),
      del({ targets: './dist/src' }),
      // esbuild({
      //   minify: true,
      // }),
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
