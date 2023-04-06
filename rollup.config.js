import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import fs from 'fs';

function writePackageJSONs() {
  return {
    name: 'example-plugin',
    buildEnd: {
      order: 'post',
      handler(res) {
        fs.writeFileSync(
          'dist/esm/package.json',
          JSON.stringify({ type: 'module' })
        );

        fs.writeFileSync(
          'dist/cjs/package.json',
          JSON.stringify({ type: 'commonjs' })
        );
      },
    },
  };
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'es',
        file: 'dist/esm/index.js',
      },
      {
        format: 'cjs',
        file: 'dist/cjs/index.js',
      },
      {
        name: 'MyLibrary',
        format: 'umd',
        file: 'dist/browser/index.js',
      },
    ],
    plugins: [
      typescript({ target: 'es2015' }),
      babel({ babelHelpers: 'bundled' }),
      writePackageJSONs(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'es',
        file: 'index.d.ts',
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        emitDeclarationOnly: true,
        declarationDir: 'dist/types',
      }),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [
      { file: 'dist/esm/index.d.ts', format: 'es' },
      { file: 'dist/cjs/index.d.ts', format: 'cjs' },
      { file: 'dist/browser/index.d.ts', format: 'umd' },
    ],
    plugins: [dts()],
  },
];
