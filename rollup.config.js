import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import commonjs from '@rollup/plugin-commonjs';

export default [
    /*
     * Main "entry" that exports startStimulusApp
     */
    {
        input: 'src/index.ts',
        output: {
            file: path.join('dist', 'index.js'),
            format: 'esm',
        },
        external: [
            // avoids rollup from trying to parse this import
            './webpack/loader!@symfony/stimulus-bridge/controllers.json',
            '@hotwired/stimulus'
        ],
        plugins: [
            resolve(),
            typescript(),
        ],
    },

    /*
     * webpack/loader.js
     *
     * This is used to load controllers.json - built so the user doesn't
     * need to parse Typescript.
     */
    {
        input: 'src/webpack/loader.ts',
        output: {
            file: path.join('dist', 'webpack', 'loader.js'),
            format: 'cjs',
        },
        external: [
            'webpack/lib/dependencies/LoaderDependency',
        ],
        plugins: [
            resolve(),
            typescript(),
            // needed to import from cjs modules, like modules from webpack
            commonjs(),
        ],
    },

    /*
     * lazy-controller-loader.js
     *
     * This is built to avoid the end-user needing to parse Typescript directly.
     */
    {
        input: 'src/webpack/lazy-controller-loader.ts',
        output: {
            file: path.join('dist', 'webpack', 'lazy-controller-loader.js'),
            format: 'cjs',
        },
        external: [
            'loader-utils',
            'schema-utils',
        ],
        plugins: [
            resolve(),
            typescript(),
        ],
    },
];
