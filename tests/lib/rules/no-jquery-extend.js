"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-jquery-extend"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-jquery-extend", rule, {
  valid: [
    { code: "$.ajax();", options: [] },
    { code: "$.ajax();", options: ["$"] },
    { code: "jQuery.ajax();", options: ["jQuery"] },
    { code: "foo.ajax();", options: ["foo"] }
  ],

  invalid: [
    {
      code: "$.lightBox();", options: [],
      errors: [
        {
          message: "'lightBox' piggybacks on '$' to extend jQuery"
        }
      ]
    },
    {
      code: "jQuery.lightBox();", options: [],
      errors: [
        {
          message: "'lightBox' piggybacks on 'jQuery' to extend jQuery"
        }
      ]
    },
    {
      code: "$.lightBox();", options: ["$"],
      errors: [
        {
          message: "'lightBox' piggybacks on '$' to extend jQuery"
        }
      ]
    },
    {
      code: "jQuery.lightBox();", options: ["jQuery"],
      errors: [
        {
          message: "'lightBox' piggybacks on 'jQuery' to extend jQuery"
        }
      ]
    },
    {
      code: "foo.lightBox();", options: ["foo"],
      errors: [
        {
          message: "'lightBox' piggybacks on 'foo' to extend jQuery"
        }
      ]
    }
  ]
});