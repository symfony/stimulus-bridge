/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const acorn = require('acorn');
const vm = require('vm');

const stimulusCommentRegExp = new RegExp(/(^|\W)stimulus[A-Z]{1,}[A-Za-z]{1,}:/);

const EMPTY_COMMENT_OPTIONS = {
    options: {},
    errors: [],
};

function getCommentsFromSource(source) {
    const comments = [];
    acorn.parse(source, {
        onComment: comments,
        sourceType: 'module',
        ecmaVersion: 2020,
    });

    return comments;
}

/**
 * Inspired by Webpack's JavaScriptParser
 */
module.exports = function parseComments(source) {
    let comments;
    try {
        comments = getCommentsFromSource(source);
    } catch (e) {
        return EMPTY_COMMENT_OPTIONS;
    }

    if (comments.length === 0) {
        return EMPTY_COMMENT_OPTIONS;
    }

    let options = {};
    let errors = [];
    for (const comment of comments) {
        const { value } = comment;
        if (value && stimulusCommentRegExp.test(value)) {
            // try compile only if stimulus options comment is present
            try {
                const val = vm.runInNewContext(`(function(){return {${value}};})()`);
                Object.assign(options, val);
            } catch (e) {
                e.comment = comment;
                errors.push(e);
            }
        }
    }
    return { options, errors };
};
