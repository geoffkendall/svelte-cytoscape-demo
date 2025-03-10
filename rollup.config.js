import svelte from 'rollup-plugin-svelte';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import sveltePreprocess from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js'
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      compilerOptions: {
        dev: !production
      },
      // we'll extract any component CSS out into
      // a separate file - better for performance
      emitCss: true,
      // Enable TypeScript preprocessing
      preprocess: sveltePreprocess({
        sourceMap: !production,
        typescript: {
          // Skips type checking for faster development
          transpileOnly: true
        }
      })
    }),
    
    // Extract CSS into a separate file
    css({ output: 'bundle.css' }),
    
    // Add TypeScript support
    typescript({ sourceMap: !production }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration 
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    nodeResolve(),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
