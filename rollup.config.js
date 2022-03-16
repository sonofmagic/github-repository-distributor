import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import pkg from './package.json'
import replace from '@rollup/plugin-replace'
// const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'
const isAction = process.env.BUILD_TARGET === 'action'

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.ts',
  output: [
    {
      file: isAction ? 'lib/index.js' : pkg.main,
      format: 'cjs',
      sourcemap: isDev,
      exports: 'auto'
    }
    // { format: 'esm', file: pkg.module, sourcemap: isDev }
  ],

  plugins: [
    replace({
      preventAssignment: true,
      values: {
        __isAction__: JSON.stringify(isAction)
      }
    }),
    json(),
    nodeResolve({
      preferBuiltins: true
    }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.build.json', sourceMap: isDev })
  ],
  external: [
    ...(pkg.dependencies ? Object.keys(pkg.dependencies) : []),
    'fs/promises'
  ]
}

export default config
