/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import vm from 'node:vm';
import { type Comment, parse } from 'acorn';

const stimulusCommentRegExp = new RegExp(/(^|\W)stimulus[A-Z]{1,}[A-Za-z]{1,}:/);

const EMPTY_COMMENT_OPTIONS = {
    options: {},
    errors: [],
};

function getCommentsFromSource(source: string): Comment[] {
    const comments: Comment[] = [];
    parse(source, {
        onComment: comments,
        sourceType: 'module',
        ecmaVersion: 2022,
    });

    return comments;
}

/**
 * Inspired by Webpack's JavaScriptParser
 */
export default function (source: string) {
    let comments: Comment[] = [];
    try {
        comments = getCommentsFromSource(source);
    } catch (e) {
        return EMPTY_COMMENT_OPTIONS;
    }

    if (comments.length === 0) {
        return EMPTY_COMMENT_OPTIONS;
    }

    const options = {};
    const errors = [];
    for (const comment of comments) {
        const { value } = comment;
        if (value && stimulusCommentRegExp.test(value)) {
            // try compile only if stimulus options comment is present
            try {
                const val = vm.runInNewContext(`(function(){return {${value}};})()`);
                Object.assign(options, val);
            } catch (e: any) {
                e.comment = comment;
                errors.push(e);
            }
        }
    }
    return { options, errors };
}
