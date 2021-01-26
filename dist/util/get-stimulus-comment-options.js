/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var acorn = require('acorn');

var vm = require('vm');

var stimulusCommentRegExp = new RegExp(/(^|\W)stimulus[A-Z]{1,}[A-Za-z]{1,}:/);
var EMPTY_COMMENT_OPTIONS = {
  options: {},
  errors: []
};

function getCommentsFromSource(source) {
  var comments = [];
  acorn.parse(source, {
    onComment: comments,
    sourceType: 'module',
    ecmaVersion: 2020
  });
  return comments;
}
/**
 * Inspired by Webpack's JavaScriptParser
 */


module.exports = function parseComments(source) {
  var comments;

  try {
    comments = getCommentsFromSource(source);
  } catch (e) {
    return EMPTY_COMMENT_OPTIONS;
  }

  if (comments.length === 0) {
    return EMPTY_COMMENT_OPTIONS;
  }

  var options = {};
  var errors = [];

  var _iterator = _createForOfIteratorHelper(comments),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var comment = _step.value;
      var value = comment.value;

      if (value && stimulusCommentRegExp.test(value)) {
        // try compile only if stimulus options comment is present
        try {
          var val = vm.runInNewContext("(function(){return {".concat(value, "};})()"));
          Object.assign(options, val);
        } catch (e) {
          e.comment = comment;
          errors.push(e);
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return {
    options: options,
    errors: errors
  };
};