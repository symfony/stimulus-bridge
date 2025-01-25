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
export default function (source: string, sourceMap: string): any;
