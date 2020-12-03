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
const createAutoimportVirtualModule = require('../../dist/webpack/create-autoimport-module');

describe('createAutoimportVirtualModule', () => {
    describe('empty.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/empty.json');
            expect(createAutoimportVirtualModule(config)).to.equal('');
        });
    });

    describe('disabled-controller.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/disabled-controller.json');
            expect(createAutoimportVirtualModule(config)).to.equal('');
        });
    });

    describe('disabled-autoimport.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/disabled-autoimport.json');
            expect(createAutoimportVirtualModule(config)).to.equal('');
        });
    });

    describe('eager-no-autoimport.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/eager-no-autoimport.json');
            expect(createAutoimportVirtualModule(config)).to.equal('');
        });
    });

    describe('lazy-autoimport.json', () => {
        it('must return a file with the enabled controller', () => {
            const config = require('../fixtures/lazy-autoimport.json');
            expect(createAutoimportVirtualModule(config)).to.equal("\nimport '@symfony/mock-module/dist/style.css';");
        });
    });
});
