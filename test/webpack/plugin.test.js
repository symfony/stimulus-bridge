/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const createStimulusBridgePlugin = require('../../dist/webpack/plugin');
const VirtualModulesPlugin = require('webpack-virtual-modules');

describe('createStimulusBridgePlugin', () => {
    it('must return created VirtualModule plugin', () => {
        const config = require('../fixtures/empty.json');
        expect(createStimulusBridgePlugin(config)).toBeInstanceOf(VirtualModulesPlugin);
    });
});
