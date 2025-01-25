/**
 * Loader that processes the controllers.json file.
 *
 * This reads the controllers key and returns an object
 * where the keys are each controller name and the value
 * is the module name (or inline class for lazy controllers)
 * for that controller.
 *
 * @param {string} source controllers.json source
 * @return {string}
 */
export default function (source: string): string;
