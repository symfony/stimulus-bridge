/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const generateLazyController = require('./generate-lazy-controller');
const getStimulusCommentOptions = require('../util/get-stimulus-comment-options');

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
 * @return {string}
 */
module.exports = function (source) {
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
    const isLazy = stimulusFetch === 'lazy';

    if (!isLazy) {
        return source;
    }

    return `import { Controller } from 'stimulus';
export default ${generateLazyController(this.resource, 0)}`;
};
