/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const expect = require('chai').expect;
const createControllersVirtualModule = require('../../dist/webpack/create-controllers-module');

describe('createControllersVirtualModule', () => {
    describe('empty.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/empty.json');
            expect(createControllersVirtualModule(config)).to.equal('module.exports = {\n};');
        });
    });

    describe('disabled-controller.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/disabled-controller.json');
            expect(createControllersVirtualModule(config)).to.equal('module.exports = {\n};');
        });
    });

    describe('disabled-autoimport.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/disabled-autoimport.json');
            expect(createControllersVirtualModule(config)).to.equal(
                "module.exports = {\n  '@symfony/mock-module/mock': import(/* webpackMode: \"lazy\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });

    describe('eager-no-autoimport.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/eager-no-autoimport.json');
            expect(createControllersVirtualModule(config)).to.equal(
                "module.exports = {\n  '@symfony/mock-module/mock': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });

    describe('lazy-autoimport.json', () => {
        it('must return a file with the enabled controller', () => {
            const config = require('../fixtures/lazy-autoimport.json');
            expect(createControllersVirtualModule(config)).to.equal(
                "module.exports = {\n  '@symfony/mock-module/mock': import(/* webpackMode: \"lazy\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });
});
