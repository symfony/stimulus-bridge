/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as loaderUtils from 'loader-utils';
import { describe, expect, it } from 'vitest';
import lazyControllerLoader from '../../src/webpack/lazy-controller-loader';
import { parseQuery } from '../parseQuery';

const isLoaderUtilsV3 = !Object.prototype.hasOwnProperty.call(loaderUtils, 'getOptions');

function callLoader(src: string, startingSourceMap = '', query = '') {
    const loaderThis = {
        emittedErrors: [],
        executedCallback: null,

        resource: './some-resource',
        query,
        emitError(error) {
            this.emittedErrors.push(error);
        },
        callback(error, content, sourceMap) {
            this.executedCallback = { error, content, sourceMap };
        },
    };

    // Re-used from https://github.com/webpack/loader-utils/blob/09128d7a9ae08da110180c31fbec11e195a75220/lib/getOptions.js
    if (isLoaderUtilsV3) {
        loaderThis.getOptions = () => {
            if (typeof query === 'string' && query !== '') {
                return parseQuery(query);
            }

            if (!query || typeof query !== 'object') {
                // Not object-like queries are not supported.
                return {};
            }

            return query;
        };
    }

    lazyControllerLoader.call(loaderThis, src, startingSourceMap);

    return {
        content: loaderThis.executedCallback.content,
        errors: loaderThis.emittedErrors,
        sourceMap: loaderThis.executedCallback.sourceMap,
        callbackErrors: loaderThis.executedCallback.errors,
    };
}

describe('lazyControllerLoader', () => {
    it('does nothing with a non-lazy controller', () => {
        const src = 'export default class extends Controller {}';
        expect(callLoader(src).content).toEqual(src);
        expect(callLoader(src, 'source_map_contents').sourceMap).toEqual('source_map_contents');
        expect(callLoader(src).errors).toHaveLength(0);
    });

    it('exports a lazy controller', () => {
        const src = "/* stimulusFetch: 'lazy' */ export default class extends Controller {}";
        // look for a little bit of the lazy controller code
        expect(callLoader(src).content).toContain('this.__stimulusLazyController');
        // unfortunately, we cannot pass along sourceMap info since we changed the source
        expect(callLoader(src, 'source_map_contents').sourceMap).toBeUndefined();
        expect(callLoader(src).errors).toHaveLength(0);
    });

    it('emits an error on a syntax problem', () => {
        const src = '/* stimulusFetch: "lazy */ export default class extends Controller {}';
        expect(callLoader(src).errors).toHaveLength(1);
    });

    it('emits an error on an invalid value', () => {
        const src = '/* stimulusFetch: "lazy-once" */ export default class extends Controller {}';
        expect(callLoader(src).errors).toHaveLength(1);
    });

    it('reads ?lazy option', () => {
        const src = 'export default class extends Controller {}';
        const results = callLoader(src, '', '?lazy=true');
        expect(results.content).toContain('this.__stimulusLazyController');
        expect(results.errors).toHaveLength(0);
    });

    it('reads ?lazy and it wins over comments', () => {
        const src = "/* stimulusFetch: 'eager' */ export default class extends Controller {}";
        const results = callLoader(src, '', '?lazy=true');
        expect(results.content).toContain('this.__stimulusLazyController');
        expect(results.errors).toHaveLength(0);
    });

    it('reads ?export for non-default exports', () => {
        const src = 'const MyController = class extends Controller {}; export { MyController };';
        const results = callLoader(src, '', '?lazy=true&export=MyController');
        // check that the results are lazy
        expect(results.content).toContain('this.__stimulusLazyController');
        // check named export
        expect(results.content).toContain('export { controller as MyController };');
        expect(results.errors).toHaveLength(0);
    });
});
