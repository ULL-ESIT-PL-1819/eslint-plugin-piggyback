# eslint-plugin-piggyback

A set of [ESLint](https://github.com/eslint/eslint) rules that help catch undeclared references that ESLint's built-in [`no-undef`](http://eslint.org/docs/rules/no-undef) rule doesn't find because they are extending other objects  
(AKA "piggybacking" :stuck_out_tongue:)

## Motivation

This ESLint plugin is useful for migrating a large legacy project that relies on global scope "pollution" into one where all module dependencies are properly declared (via AMD, CommonJS, ES6 Modules, etc.) and automatic module-bundling is possible.  
For the most part ESLint's [`no-undef`](http://eslint.org/docs/rules/no-undef) will get you most of the way there, but each of these custom rules handle a certain edge-case that it does not.

### `no-restricted-global-extend`

Consider the result of linting this code with ESLint when just the `no-undef` rule is in-use:

```javascript
/*eslint-env browser*/
Foo.bar(); //`Foo` is not defined in this script. `no-undef` will catch this
window.location.reload(); //`window` is not defined in this script but `no-undef` will not throw an error because `window` has been white-listed as a valid global
window.Foo.baz(); //This will not throw an error despite `Foo` not being defined anywhere and is not a valid property of `window`
```

In the case above `browser` is set as the environment because you want to access `window.location` which is valid because it exists in any browser.
But once you do this anyone can assign and access other properties on `window` without triggering a lint violation, which is why no error is thrown for `window.Foo.baz()`.

The `no-restricted-global-extend` rule can identify cases where you're using an object which references the global scope (e.g. `window` in front-end code), and it will alert you if the property you're accessing is not available in the global scope in that environment.

With both `no-under` and `no-restricted-global-extend` in-use:

```javascript
/*eslint-env browser*/
Foo.bar(); //`Foo` is not defined in this script. `no-undef` will catch this
window.location.reload(); //`window` is not defined in this script but `no-undef` will not throw an error because `window` has been white-listed as a valid global
window.Foo.baz(); //This will now throw an error
```

### `no-jquery-extend`

This rule helps catch cases where you're using [jQuery plugins](http://plugins.jquery.com/) (e.g. [`$.cookie`](https://github.com/carhartl/jquery-cookie), [`$.query`](https://github.com/blairmitchelmore/jquery.plugins)).
jQuery plugins are somewhat of an anti-pattern when it comes to properly declaring your module dependencies because they don't export anything, but rather extend the jQuery object itself.
Generally speaking, if you're refactoring old code that uses a jQuery plugin, there's probably a modern library available that provides the same functionality without relying on or extending jQuery.

With `no-jquery-extend` in-use:

```javascript
import $ from 'jquery';

$.ajax( ... ); //This is fine.
$.when( ... ); //This is fine.
$.cookie( ... ); //This will now trigger an ESLint warning
```

**Note:** This rule will only catch jQuery plugins that extend the jQuery object. It cannot catch jQuery plugins that extend jQuery elements (via `jQuery.fn`).

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-piggyback`:

```
$ npm install eslint-plugin-piggyback --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-piggyback` globally.

## Usage

Add `piggyback` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "piggyback"
    ]
}
```

#### Add the `no-restricted-global-extend` rule

Configure the 'no-restricted-global-extend' under the rules section in your `.eslintrc` configuration file.
You must specify which identifiers reference the global scope in your environment (e.g. 'window').

```json
{
    "rules": {
        "piggyback/no-restricted-global-extend": [2, "window"]
    }
}
```

#### Add the `no-jquery-extend` rule


Configure the 'no-jquery-extend' under the rules section in your `.eslintrc` configuration file.
You can specify which identifiers reference the jQuery library in your code (default: `$` & `jQuery`).

```json
{
    "rules": {
        "piggyback/no-jquery-extend": [2, "$", "jQuery", "myJQuery"]
    }
}
```

## Changelog

**1.0.0** - Add the `no-jquery-extend` rule. This is a breaking change because as of this version Node.js >= 4 or newer is required.

## Running tests
Run mocha tests with `npm test`
