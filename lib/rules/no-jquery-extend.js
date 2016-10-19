/**
 * @fileoverview Disallow extending the jQuery object (e.g. `$.cookie`, `$.query`)
 * @author cowchimp
 * @copyright 2016 cowchimp. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var jsdom = require('jsdom');
var jQuery = require('jquery');

var window = jsdom.jsdom().defaultView;
var $ = jQuery(window);

module.exports = {
  meta: {
    docs: {},

    schema: {
      "type": "array",
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    }
  },

  create: function(context) {
    var jQueryIdentifiers = context.options;
    if (jQueryIdentifiers.length === 0) {
      jQueryIdentifiers = [ "$", "jQuery" ];
    }

    return {
      "MemberExpression": function(node) {
        if(node.object.type === "Identifier" && isJQuery(node.object) && !isValidJQueryProperty(node.property)) {
          context.report(node, "'{{propertyName}}' piggybacks on '{{objectName}}' to extend jQuery", { propertyName: node.property.name, objectName: node.object.name });
        }
      }
    };

    function isJQuery(node) {
      return jQueryIdentifiers.some(function(identifier) {
        return identifier == node.name;
      });
    }

    function isValidJQueryProperty(node) {
      return typeof $[node.name] != 'undefined';
    }
  }
};