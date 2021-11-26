/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * Webpack config used to build src/index.js with Stimulus embedded
 * to allow testing in node.
 */

const path = require('path');

module.exports = {
    target: 'node',
    mode: 'development',
    devtool: 'source-map',
    entry: './dist/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2',
    },
    resolve: {
        alias: {
            '@symfony/stimulus-bridge/controllers.json': path.resolve(__dirname, './controllers.json'),
        },
    },
};
