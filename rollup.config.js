import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import path from 'path';

import { nodeResolve } from '@rollup/plugin-node-resolve';

const { npm_package_name, npm_package_version } = process.env;

const name = 'saySomething'; // ! Don't forget to change this. This is the name of the global variable
const banner = `/** ${npm_package_name} @version ${npm_package_version} */\n`;

export default {
  input: 'src/index.ts',
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
  plugins: [
    nodeResolve(),
    babel({ babelHelpers: 'bundled' }),
    typescript({
      declaration: false,
    }),
  ],
};
