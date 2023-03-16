# Symfony UX Stimulus bridge

The Stimulus bridge integrates [Stimulus](https://stimulus.hotwired.dev/)
into your Symfony app by automatically loading both third-party controllers
and your own custom controllers. It works by reading a `controllers.json`
file that describes your third-party controllers. This file is updated
automatically when you install [Symfony UX Packages](https://github.com/symfony/ux).

Before you start, familiarize yourself with the basics of
[Stimulus](https://stimulus.hotwired.dev/).

## Installation

If you don't already have Webpack Encore installed, install it with:

```
composer require encore
```

If you didn't already have Webpack Encore installed, this should execute a
Symfony Flex recipe that will set up everything for you. Finish by
running Encore:

```sh
yarn encore dev --watch
```

If you already had Encore installed (and so the recipe did not run), you
can always install things manually.

## Manual Installation

The Webpack Encore recipe usually handles setting up everything you need.
But you can also do it manually. First, install the bridge:

```sh
yarn add @symfony/stimulus-bridge @hotwired/stimulus --dev
```

Next, create an `assets/controllers.json` file: Flex will update
this whenever you install a UX package:

```json
{
    "controllers": [],
    "entrypoints": []
}
```

Now, enable the Stimulus Bridge in Webpack Encore:

```javascript
// webpack.config.js

// Provide the location of your controllers.json file
Encore.enableStimulusBridge('./assets/controllers.json');
```

Finally, use the package in your JavaScript code. This will register
any controllers defined in `controllers.json` (these are added
automatically when installing UX packages) and any controllers that
you add in `assets/controllers/`:

```javascript
// assets/app.js
// (or assets/bootstrap.js - and then import it from app.js)

import { startStimulusApp } from '@symfony/stimulus-bridge';

export const app = startStimulusApp(require.context(
    '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
    true,
    /\.(j|t)sx?$/
));
```

That's it! Now run Encore:

```sh
yarn encore watch
```

## Usage: Installing UX Packages

Once the bridge is installed and enabled, you can use any of the
[Symfony UX Packages](https://github.com/symfony/ux). After installing
each one, Symfony Flex will update your `assets/controllers.json` file.
That will cause this bridge to automatically import and register that
controller so that you can use it *immediately* without any configuration.

## Usage: Creating Custom Controllers

You'll also want to create your own custom controllers. The bridge
automatically registers any controllers that live in the `assets/controllers/`.

Let's see an example: create a new `assets/controllers/hello_controller.js`
file (you may already have this):

```
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    connect() {
        this.element.textContent = 'Hello Stimulus! Edit me in assets/controllers/hello_controller.js';
    }
}
```

Because this file is called `hello_controller.js`, it will register a controller
named (`hello`). This follows the standard Stimulus naming conventions. Thanks
to this, in any template, you can now add an element that uses this:

```twig
# templates/anything/any_template.html.twig

<div data-controller="hello"></div>
```

Try it! When you refresh the page, your controller will be executed and
the source will update to:

```html
<div data-controller="hello">
    Hello Stimulus! Edit me in assets/controllers/hello_controller.js    
</div>
```

If the controller lives in a subdirectory - like `assets/controllers/blog/post/author_controller.js` -
the name will include `--` in place of each `/`:

```html
<div data-controller="blog--post--author">
    <div data-blog--post--author-target="author">...</div>
</div>
```

See the [Stimulus Docs](https://stimulus.hotwired.dev/handbook/introduction)
for what else Stimulus can do!

## Common Errors

If you get this error:

> ./assets/bootstrap.js contains a reference to the file @symfony/autoimport.
> This file can not be found.

Remove the following line in the mentioned file: it's not needed anymore:

```diff
// assets/bootstrap.js

// ...
- import '@symfony/autoimport';
```

If you get the error:

> Cannot find module '@symfony/stimulus-bridge/webpack-helper'

Be sure to upgrade to `@symfony/webpack-encore` version 1.0.0 or higher.

## The controllers.json File

The bridge works by reading a `controllers.json` file that is automatically
updated by Symfony Flex whenever you download a UX-powered package. For
example, after running `composer require symfony/ux-dropzone`, it will
look like this:

```json
{
    "controllers": {
        "@symfony/ux-dropzone": {
            "dropzone": {
                "enabled": true,
                "fetch": "eager",
                "autoimport": {
                    "@symfony/ux-dropzone/src/style.css": true
                }
            }
        }
    },
    "entrypoints": []
}
```

Each item under `controllers` will cause a Stimulus controller to be
registered with a specific name - in this case the controller would
be called `symfony--ux-dropzone--dropzone` (the `/` becomes `--`).

By default, the new controller will always be included in your
JavaScript package. You can control that with the `fetch` option,
ordered from least to most lazy:

* `fetch: 'eager'`: controller & dependencies are included in the JavaScript
  that's downloaded when the page is loaded.
* `fetch: 'lazy'`: controller & dependencies are isolated into a
  separate file and only downloaded asynchronously if (and when) the `data-controller`
  HTML appears on the page.

## Lazy Controllers

**NOTE**: When using lazy controllers, you may notice in your browser's console that
your controller appears to be initialized and connected *twice*. But actually, the
first initialize and connect are just a result of an internal controller setting
up your real controller.

You can also make your own controllers "lazy": giving them the same behavior
as the `lazy-controller` explained above. In this case, your controller isn't
downloaded until an element for that controller first appears on the page.

To activate this, first make sure that you're using the special loader -
`@symfony/stimulus-bridge/lazy-controller-loader` - when loading your controllers:

```js
// assets/bootstrap.js

export const app = startStimulusApp(require.context(
    '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
    true,
    /\.(j|t)sx?$/
));
```

Next, you can make any controllers lazy by adding a `/* stimulusFetch: 'lazy' */`
comment above that controller:

```js
import { Controller } from '@hotwired/stimulus';

/* stimulusFetch: 'lazy' */
export default class extends Controller {
    // ...
}
```

### Advanced Lazy Controllers

Sometimes you may want to use a third-party controller and make it lazy.
Unfortunately, you can't edit that controller's source code to add
the `/* stimulusFetch: 'lazy' */`.

To handle this, you can use the `lazy-controller-loader` with some
custom query options.

```js
// assets/bootstrap.js

import { startStimulusApp } from '@symfony/stimulus-bridge';

// example from https://stimulus-components.netlify.app/docs/components/stimulus-clipboard/
// normal, non-lazy import
//import Clipboard from 'stimulus-clipboard';
// lazy import
import Clipboard from '@symfony/stimulus-bridge/lazy-controller-loader?lazy=true!stimulus-clipboard';

// example from https://github.com/afcapel/stimulus-autocomplete
// normal, non-lazy import
//import { Autocomplete } from 'stimulus-autocomplete';
// lazy import - it includes export=Autocomplete to handle the named export
import { Autocomplete } from '@symfony/stimulus-bridge/lazy-controller-loader?lazy=true&export=Autocomplete!stimulus-autocomplete';

const app = startStimulusApp(require.context(
    // your existing code to load from controllers/
));

// the normal way to manually register controllers
app.register('clipboard', Clipboard);
app.register('autocomplete', Autocomplete);

export { app };
```

## Writing TypeScript controllers

If you want to write TypeScript controllers, make sure the target of your TypeScript config is set to `ES6`:

```json
{
    "compilerOptions": {
        //...
        "target": "ES6",
    },
    //...
}
```

If you don't you may face the following issue in your browser console when the controller is called:

```
# Error thrown in Chrome console:
Uncaught (in promise) TypeError: Class constructor Controller cannot be invoked without 'new'

# Error thrown in Firefox console:
Uncaught (in promise) TypeError: class constructors must be invoked with 'new'
```

The error is caused when an ES5 class tries to "extend" an ES6 class. If the target is not correctly set, 
TypeScript will transpile the controller to old ES5 code. But Stimulus 3 uses pure ES6 classes. 
This causes an incompatibility, hence the need to target ES6 explicitly.

## Run tests

```sh
yarn test
```
