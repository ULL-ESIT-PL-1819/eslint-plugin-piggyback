# eslint-plugin-piggyback

Contains the `no-restricted-global-extend` rule:  
Disallow extending the global scope by extending objects that reference it (e.g. 'window')  
(AKA "piggybacking" :stuck_out_tongue:)

## Motivation

Not too long ago, the common way separating your code into "modules" was to define an object on the global scope in one script and access it from another script.  
Nowadays, with the advent of module systems (AMD,CJS,ES6), you might want to avoid "polluting" the global scope.  
In order to enforce this with [ESLint](http://eslint.org), you'll want to use the built-in rule [`no-undef`](http://eslint.org/docs/rules/no-undef) which will catch any variable not defined within the script.

```javascript
(function() {
  Foo.bar(); //`Foo` is not defined in this script. `no-undef` will catch this
})():
```

It's common to have some variables that are defined elsewhere but should not throw any errors, such as `window` if you're writing front-end code.

```javascript
/*eslint-env browser*/
(function() {
  window.location.reload(); //`window` is not defined in this script but `no-undef` will not throw an error because `window` has been white-listed as a valid global
})();

```

In the case above `browser` is set as the environment because you want to access `window.location` which is valid because it exists in any browser (you could also just set `/*global window*/`).  
But once you do this anyone can assign and access other properties on `window` without triggering a lint violation.

```javascript
/*eslint-env browser*/
(function() {
  window.Foo.bar(); //This will not throw an error despite `Foo` not being defined anywhere and is not a valid property of `window`
})();
```

This is where `no-restricted-global-extend` comes in. It can identify cases where you're using an object which references the global scope, and it will alert you if the property you're accessing is not available in the global scope.  
This rule can be used in unison with `no-undef`. See the 'Usage' section below on how to configure it.

```javascript
/*eslint-env browser*/
(function() {
  window.location.reload(); //This is fine
  window.console.log();     //This is fine
  window.Foo.bar();         //This will throw an error
})();
```

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


Then configure the 'no-restricted-global-extend' under the rules section.  
You must specify which identifiers reference the global scope in your environment (e.g. 'window').

```json
{
    "rules": {
        "piggyback/no-restricted-global-extend": [2, "window"]
    }
}
```

## Running tests
Run mocha tests with `npm test`