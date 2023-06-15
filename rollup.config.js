import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import path from 'path';

import { nodeResolve } from '@rollup/plugin-node-resolve';

const { npm_package_name, npm_package_version } = process.env;

const name = 'saySomething';
const banner = `/** ${npm_package_name} @version ${npm_package_version} */\n`;

const input = 'src/index.ts';

export default [
  {
    // module
    input,
    output: {
      banner,
      format: 'esm',
      preserveModules: true,
      dir: path.resolve('dist'),
    },

    plugins: [
      nodeResolve(),
      typescript({
        declaration: true,
        declarationDir: path.resolve('dist'),
      }),
    ],
  },
  {
    // browser
    input,
    output: [
      {
        name,
        banner,
        format: 'umd',
        file: path.resolve('dist', 'browser', 'index.js'),
        sourcemap: true,
      },
      {
        name,
        banner,
        format: 'umd',
        file: path.resolve('dist', 'browser', 'index.min.js'),
        plugins: [terser()],
      },
    ],
    plugins: [nodeResolve(), babel({ babelHelpers: 'bundled' }), typescript()],
  },
];
