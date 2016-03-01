"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-restricted-global-extend"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-restricted-global-extend", rule, {
  valid: [
    { code: "/*global foo*/ window.foo();", options: ["window"] },
    { code: "/*global window, foo*/ (function() { window.foo(); })();", options: ["window"] },
    { code: "/*eslint-env browser*/ (function() { window.location.reload(); })();", options: ["window"] }
  ],

  invalid: [
    {
      code: "/*global window*/ (function() { window.foo = 'bar'; })();", options: ["window"],
      errors: [
        {
          message: "'foo' piggybacks on 'window' to extend the global scope"
        }
      ]
    },
    {
      code: "/*eslint-env browser*/ (function() { window.foo = 'bar'; })();", options: ["window"],
      errors: [
        {
          message: "'foo' piggybacks on 'window' to extend the global scope"
        }
      ]
    },
    {
      code: "/*global window*/ (function() { window.foo(); })();", options: ["window"],
      errors: [
        {
          message: "'foo' piggybacks on 'window' to extend the global scope"
        }
      ]
    },
    {
      code: "/*eslint-env browser*/ (function() { window.foo(); })();", options: ["window"],
      errors: [
        {
          message: "'foo' piggybacks on 'window' to extend the global scope"
        }
      ]
    },
    {
      code: "/*global window*/ (function() { window.foo.bar(); })();", options: ["window"],
      errors: [
        {
          message: "'foo' piggybacks on 'window' to extend the global scope"
        }
      ]
    },
    {
      code: "/*eslint-env browser*/ (function() { window.foo.bar(); })();", options: ["window"],
      errors: [
        {
          message: "'foo' piggybacks on 'window' to extend the global scope"
        }
      ]
    }
  ]
});