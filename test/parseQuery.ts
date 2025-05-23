// This file is copied from https://github.com/symfony/stimulus-bridge/blob/main/src/webpack/lazy-controller-loader.ts
// to keep "emulated" call to loader working when using loader-utils@^3.0.0.

import JSON5 from 'json5';

const specialValues = {
    null: null,
    true: true,
    false: false,
};

export function parseQuery(query) {
    if (query.substr(0, 1) !== '?') {
        throw new Error("A valid query string passed to parseQuery should begin with '?'");
    }

    query = query.substr(1);

    if (!query) {
        return {};
    }

    if (query.substr(0, 1) === '{' && query.substr(-1) === '}') {
        return JSON5.parse(query);
    }

    const queryArgs = query.split(/[,&]/g);
    const result = {};

    queryArgs.forEach((arg) => {
        const idx = arg.indexOf('=');

        if (idx >= 0) {
            let name = arg.substr(0, idx);
            let value = decodeURIComponent(arg.substr(idx + 1));

            // eslint-disable-next-line no-prototype-builtins
            if (specialValues.hasOwnProperty(value)) {
                value = specialValues[value];
            }

            if (name.substr(-2) === '[]') {
                name = decodeURIComponent(name.substr(0, name.length - 2));

                if (!Array.isArray(result[name])) {
                    result[name] = [];
                }

                result[name].push(value);
            } else {
                name = decodeURIComponent(name);
                result[name] = value;
            }
        } else {
            if (arg.substr(0, 1) === '-') {
                result[decodeURIComponent(arg.substr(1))] = false;
            } else if (arg.substr(0, 1) === '+') {
                result[decodeURIComponent(arg.substr(1))] = true;
            } else {
                result[decodeURIComponent(arg)] = true;
            }
        }
    });

    return result;
}
