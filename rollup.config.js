import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

// Node-targeted build configuration (CJS + ESM)
const nodeBuildConfig = {
  input: 'src/index.ts',
  external: [], // No external dependencies - uses native fetch API
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs.min.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: 'dist/index.esm.min.js',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve({
      // Node-first resolution for these builds
      browser: false,
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false, // We'll generate types separately
      declarationMap: false,
      sourceMap: true,
    }),
  ],
};

// Browser-targeted build configuration (UMD).
// Produces a UMD bundle suitable for <script> inclusion and CDN usage.
const browserBuildConfig = {
  input: 'src/index.ts',
  external: [],
  output: [
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: packageJson.name || 'WAHA',
      sourcemap: true,
      globals: {},
    },
    {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: packageJson.name || 'WAHA',
      sourcemap: true,
      plugins: [terser()],
      globals: {},
    },
  ],
  plugins: [
    // For browser bundles prefer browser field and do not prefer builtins
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      sourceMap: true,
    }),
  ],
};

// Type definitions build configuration
const dtsConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'esm',
  },
  plugins: [dts()],
};

export default [nodeBuildConfig, browserBuildConfig, dtsConfig];