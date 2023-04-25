import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import dts from 'rollup-plugin-dts';

import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.ts',
    output: {
      format: 'esm',
      dir: 'dist/',
    },

    plugins: [
      nodeResolve(),
      babel({ babelHelpers: 'bundled' }),
      typescript({ esModuleInterop: true, module: 'ESNext' }),
      cleanup({ comments: 'jsdoc' }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'esm',
      dir: 'dist/',
    },
    plugins: [dts()],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'createForm',
        format: 'umd',
        file: 'dist/browser/index.js',
        sourcemap: true,
      },
      {
        name: 'createForm',
        format: 'umd',
        file: 'dist/browser/index.min.js',
        plugins: [terser()],
      },
    ],
    plugins: [
      nodeResolve(),
      babel({ babelHelpers: 'bundled' }),
      typescript(),
      cleanup({ comments: 'jsdoc' }),
    ],
  },
];
