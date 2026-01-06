import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
  input: 'src/index.ts',
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      sourceMap: true
    })
  ]
};

export default [
  // UMD build (for browser <script> tags - backward compatible)
  {
    ...baseConfig,
    output: {
      file: 'dist/dreamcast3.js',
      format: 'umd',
      name: 'dreamcast3',
      sourcemap: true,
      globals: {}
    }
  },

  // UMD minified build
  ...(isProduction ? [{
    ...baseConfig,
    output: {
      file: 'dist/dreamcast3.min.js',
      format: 'umd',
      name: 'dreamcast3',
      sourcemap: true,
      plugins: [terser()]
    }
  }] : []),

  // ES Module build (for modern bundlers)
  {
    ...baseConfig,
    output: {
      file: 'dist/dreamcast3.esm.js',
      format: 'es',
      sourcemap: true
    }
  },

  // CommonJS build (for Node.js tools)
  {
    ...baseConfig,
    output: {
      file: 'dist/dreamcast3.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  }
];
