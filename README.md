# Symfony UX Stimulus bridge

The Stimulus bridge integrates [Stimulus](https://stimulus.hotwire.dev/)
into your Symfony app by automatically loading both third-party controllers
and your own custom controllers. It works by reading a `controllers.json`
file that describes your third-party controllers. This file is updated
automatically when you install [Symfony UX Packages](https://github.com/symfony/ux).

Before you start, familiarize yourself with the basics of
[Stimulus](https://stimulus.hotwire.dev/).

Symfony UX Stimulus bridge is currently considered **experimental**.

## Installation

If you don't already have Webpack Encore installed, install it with:

```
composer require encore
```

If you didn't already have Webpack Encore installed, this should execute a
Symfony Flex recipe that will set up everything for you. Finish by
running Encore:

```sh
yarn encore watch
```

If you already had Encore installed (and so the recipe did not run), you
can always install things manually.

## Manual Installation

The Webpack Encore recipe usually handles setting up everything you need.
But you can also do it manually. First, install the bridge:

```sh
yarn add @symfony/stimulus-bridge stimulus --dev
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
import { Controller } from 'stimulus';

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

See the [Stimulus Docs](https://stimulus.hotwire.dev/handbook/introduction)
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
import { Controller } from 'stimulus';

/* stimulusFetch: 'lazy' */
export default class extends Controller {
    // ...
}
```

## Run tests

```sh
yarn test
```
