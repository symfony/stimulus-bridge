import { defineConfig } from 'rolldown'
import path from "node:path";
import typescript from '@rollup/plugin-typescript';

export default defineConfig([
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
            '@hotwired/stimulus',
        ],
        plugins: [typescript()],
    },

    /*
     * webpack/loader.js
     *
     * This is used to load controllers.json - built so the user doesn't
     * need to parse Typescript.
     */
    {
        input: 'src/webpack/loader.ts',
        output: [
            {
                file: path.join('dist', 'webpack', 'loader.js'),
                format: 'cjs',
            },
            {
                file: path.join('dist', 'webpack', 'loader.mjs'),
                format: 'esm',
            },
        ],
        external: ['webpack/lib/dependencies/LoaderDependency'],
        plugins: [typescript()],
    },

    /*
     * lazy-controller-loader.js
     *
     * This is built to avoid the end-user needing to parse Typescript directly.
     */
    {
        input: 'src/webpack/lazy-controller-loader.ts',
        output: [
            {
                file: path.join('dist', 'webpack', 'lazy-controller-loader.js'),
                format: 'cjs',
            },
            {
                file: path.join('dist', 'webpack', 'lazy-controller-loader.mjs'),
                format: 'esm',
            },
        ],
        external: ['loader-utils', 'schema-utils'],
        plugins: [typescript()],
    },
])
