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

var generateLazyController = require('./generate-lazy-controller');

var getStimulusCommentOptions = require('../util/get-stimulus-comment-options');
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
  var _getStimulusCommentOp = getStimulusCommentOptions(source),
      options = _getStimulusCommentOp.options,
      errors = _getStimulusCommentOp.errors;

  var _iterator = _createForOfIteratorHelper(errors),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var error = _step.value;
      this.emitError(new Error("Invalid comment found:\n\n    \"/* ".concat(error.comment.value.trim(), " */\".\n\nCheck your syntax.")));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var stimulusFetch = typeof options.stimulusFetch !== 'undefined' ? options.stimulusFetch : 'eager';

  if (!['eager', 'lazy'].includes(stimulusFetch)) {
    this.emitError(new Error("Invalid value \"".concat(stimulusFetch, "\" found for \"stimulusFetch\". Allowed values are \"lazy\" or \"eager\"")));
  }

  var isLazy = stimulusFetch === 'lazy';

  if (!isLazy) {
    return source;
  }

  return "import { Controller } from 'stimulus';\nexport default ".concat(generateLazyController(this.resource, 0));
};