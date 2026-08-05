/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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

// Parse the options as an object expression and keep only literal values; the comment is never evaluated.
function parseCommentOptions(value: string): Record<string, unknown> {
    const program = parse(`({${value}})`, { ecmaVersion: 2022 });
    const statement = program.body[0];
    if (
        program.body.length !== 1 ||
        statement.type !== 'ExpressionStatement' ||
        statement.expression.type !== 'ObjectExpression'
    ) {
        throw new Error('Expected a list of "key: value" options');
    }

    const options: Record<string, unknown> = {};
    for (const property of statement.expression.properties) {
        if (property.type !== 'Property' || property.computed) {
            throw new Error('Unexpected option');
        }

        const key =
            property.key.type === 'Identifier'
                ? property.key.name
                : property.key.type === 'Literal'
                  ? String(property.key.value)
                  : null;
        if (key === null) {
            throw new Error('Unexpected option name');
        }

        if (property.value.type !== 'Literal') {
            throw new Error(`Option "${key}" must be a literal value`);
        }

        options[key] = property.value.value;
    }

    return options;
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
            try {
                Object.assign(options, parseCommentOptions(value));
            } catch (e: any) {
                e.comment = comment;
                errors.push(e);
            }
        }
    }
    return { options, errors };
}
