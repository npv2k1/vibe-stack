import { readFileSync } from 'fs';
import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import terser from '@rollup/plugin-terser';
import svgr from '@svgr/rollup';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescriptEngine from 'typescript';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import esbuild from 'rollup-plugin-esbuild';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import inject from '@rollup/plugin-inject';

const packageJson = JSON.parse(readFileSync('./package.json'));

const useClientBanner = {
  name: 'use-client-banner',
  generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle)) {
      if (chunk.type === 'chunk' && chunk.isEntry) {
        chunk.code = '"use client";\n' + chunk.code;
      }
    }
  },
};

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        banner: '"use client";',
      },
      {
        file: packageJson.module,
        format: 'es',
        exports: 'named',
        sourcemap: true,
        banner: '"use client";',
      },
    ],
    plugins: [
      useClientBanner,
      esbuild({ minify: false, sourceMap: true, target: 'es2015' }),
      external({ includeDependencies: true }),
      resolve(),
      commonjs(),
      svgr(),
      url(),
      typescript({
        tsconfig: './tsconfig.json',
        typescript: typescriptEngine,
        sourceMap: true,
      }),
      terser(),

      optimizeLodashImports(),
    ],
    jsxImportSource: '@emotion/react', // ← thêm dòng này
  },
  {
    input: './src/styles.css',
    output: {
      file: './dist/styles.css',
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        sourceMap: true,
        plugins: [tailwindcss(), autoprefixer()],
      }),
    ],
  },
]);
