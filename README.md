# Symfony UX Stimulus bridge

This repository is the Stimulus integration bridge for Symfony projects which allow
reusable code to be shipped in your applications.

It contains a helper to initialize a Stimulus application based on vendor 
controllers and application code. It also contains a Webpack plugin used by 
Webpack Encore to include vendor controllers and styles into application built files.

In new Symfony applications, this package is automatically configured by Symfony Flex to
work out of the box. **You probably don't need to configure this package yourself.**

Symfony UX Stimulus bridge is currently considered **experimental**.

## Installation

```sh
yarn add @symfony/stimulus-bridge
```

## Usage

To use it, first configure Webpack Encore:

```javascript
// webpack.config.js

// Provide the location of your controllers.json file
Encore.enableStimulusBridge('./assets/controllers.json');
```

Then use the package in your JavaScript code:

```javascript
// app.js (or bootstrap.js if you use the standard Symfony structure)

import { startStimulusApp } from '@symfony/stimulus-bridge';

export const app = startStimulusApp(require.context('./controllers', true, /\.(j|t)sx?$/));
```

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

## Run tests

```sh
yarn test
```
