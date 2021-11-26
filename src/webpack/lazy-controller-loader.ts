/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import generateLazyController from './generate-lazy-controller';
import getStimulusCommentOptions from '../util/get-stimulus-comment-options';
import * as loaderUtils from 'loader-utils';
import * as schemaUtils from 'schema-utils';

const schema = {
    type: 'object',
    properties: {
        lazy: {
            type: 'boolean',
        },
        export: {
            type: 'string',
        },
    },
};

/**
 * Loader that can make a Stimulus controller lazy.
 *
 * This loader is meant to be used to load the Stimulus controllers
 * themselves. It detects a stimulusFetch: 'lazy' comment above the
 * controller. If present, the controller is replaced by a controller
 * that will lazily import the real controller the first time the
 * element appears.
 *
 * @param {string} source of a module that exports a Stimulus controller
 * @param {string} sourceMap the current source map string
 *
 * @return {string}
 */
export default function (source: string, sourceMap: string) {
    const { options, errors } = getStimulusCommentOptions(source);

    for (const error of errors) {
        this.emitError(
            new Error(`Invalid comment found:\n\n    "/* ${error.comment.value.trim()} */".\n\nCheck your syntax.`)
        );
    }

    const stimulusFetch = typeof options.stimulusFetch !== 'undefined' ? options.stimulusFetch : 'eager';
    if (!['eager', 'lazy'].includes(stimulusFetch)) {
        this.emitError(
            new Error(
                `Invalid value "${stimulusFetch}" found for "stimulusFetch". Allowed values are "lazy" or "eager"`
            )
        );
    }

    const loaderOptions = loaderUtils.getOptions(this);

    schemaUtils.validate(schema, loaderOptions, {
        name: '@symfony/stimulus-bridge/lazy-controller-loader',
        baseDataPath: 'options',
    });

    // the ?lazy= loader option takes priority over the comment
    const isLazy = typeof loaderOptions.lazy !== 'undefined' ? loaderOptions.lazy : stimulusFetch === 'lazy';

    if (!isLazy) {
        return this.callback(null, source, sourceMap);
    }

    const exportName = typeof loaderOptions.export !== 'undefined' ? loaderOptions.export : 'default';

    const finalSource = `import { Controller } from '@hotwired/stimulus';
const controller = ${generateLazyController(this.resource, 0, exportName)};
export { controller as ${exportName} };`;

    // The source Map cannot be passed when lazy, as the sourceMap won't
    // map up to the new source. In theory, this is fixable, but I'm
    // not entirely sure how.
    this.callback(null, finalSource);
}
