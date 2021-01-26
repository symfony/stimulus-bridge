/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const lazyControllerLoader = require('../../dist/webpack/lazy-controller-loader');

function callLoader(src, errors = []) {
    const loaderThis = {
        resource: './some-resource',
        emitError(error) {
            errors.push(error);
        },
    };

    return lazyControllerLoader.call(loaderThis, src);
}

describe('lazyControllerLoader', () => {
    it('does nothing with a non-lazy controller', () => {
        const src = 'export default class extends Controller {}';
        expect(callLoader(src)).toEqual(src);
    });

    it('it exports a lazy controller', () => {
        const src = "/* stimulusFetch: 'lazy' */ export default class extends Controller {}";
        // look for a little bit of the lazy controller code
        expect(callLoader(src)).toContain('application.register(');
    });

    it('it emits an error on a syntax problem', () => {
        const src = '/* stimulusFetch: "lazy */ export default class extends Controller {}';
        const errors = [];
        callLoader(src, errors);
        expect(errors).toHaveLength(1);
    });

    it('it emits an error on an invalid value', () => {
        const src = '/* stimulusFetch: "lazy-once" */ export default class extends Controller {}';
        const errors = [];
        callLoader(src, errors);
        expect(errors).toHaveLength(1);
    });
});
