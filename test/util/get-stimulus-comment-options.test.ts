/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import getStimulusCommentOptions from '../../src/util/get-stimulus-comment-options';

describe('getStimulusCommentOptions', () => {
    it('parses source with no comments', () => {
        const src = 'export default class extends Controller {}';
        expect(getStimulusCommentOptions(src)).toEqual({
            options: {},
            errors: [],
        });
    });

    it('parses source with matching and non-matching comments', () => {
        const src = '/* stimulusOption: "foo" */ /* somethingElse: "bar" */ export default class extends Controller {}';
        expect(getStimulusCommentOptions(src)).toEqual({
            options: { stimulusOption: 'foo' },
            errors: [],
        });
    });

    it('parses source with comment syntax error is returned', () => {
        const src = '/* stimulusOption: foo" */ export default class extends Controller {}';
        const { errors } = getStimulusCommentOptions(src);
        expect(errors).toHaveLength(1);
        expect(errors[0].comment.value).toEqual(' stimulusOption: foo" ');
    });

    it('parses source with JavaScript syntax error return empty', () => {
        const src = '/* stimulusOption: foo" */ export default class extends Controller }';
        expect(getStimulusCommentOptions(src)).toEqual({
            options: {},
            errors: [],
        });
    });
});
