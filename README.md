# Installation

* `npm install`
* `npm run build`

## What it does

Runs esbuild.config.js to start the esbuild bundling process. In the esbuild config we define, that we should use the `NativeClassDecoratorPlugin`.

This plugin for esbuild checks if .ts files have a `@NativeClass` decorator. It then generates an abstract syntax tree of that file with `@babel/parser`. Classes that are decorated with @NativeClass are then transpiled to ES5 syntax.